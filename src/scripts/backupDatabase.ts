import { exec } from "child_process";
import { S3 } from "aws-sdk";
import { Client } from "pg";
import { mkdirp } from "fs-extra";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const client = new Client({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

async function backup() {
  await client.connect();

  const { rows } = await client.query(`SELECT current_date`);
  const currentDate = rows[0].current_date
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const currentTime = new Date()
    .toISOString()
    .split("T")[1]
    .split(".")[0]
    .replace(/:/g, "");

  const backupFileName = `${process.env.PROJECT_NAME || "tarea"}${
    process.env.DB_DATABASE
  }-${currentDate}.${currentTime}.sql`;

  await mkdirp("./backups");

  const backupFilePath = `./backups/${backupFileName}`;

  const env = { PGPASSWORD: process.env.DB_PASSWORD };

  exec(
    `pg_dump -U ${process.env.DB_USERNAME} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} ${process.env.DB_DATABASE} > ${backupFilePath}`,
    { env },
    async (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing backup: ${err}`);
        return;
      }

      console.log(`Backup completed successfully: ${backupFilePath}`);

      const backupFileContent = await new Promise<Buffer>((resolve, reject) => {
        const stream = require("fs").createReadStream(backupFilePath);
        const chunks: Uint8Array[] = [];

        stream.on("data", (chunk: Uint8Array) => {
          chunks.push(chunk);
        });

        stream.on("error", (err: Error) => {
          reject(err);
        });

        stream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      });

      const uploadResult = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: backupFileName,
          Body: backupFileContent,
        })
        .promise();

      console.log(`Backup uploaded to S3: ${uploadResult.Location}`);

      // List all objects in the bucket
      const listObjectsResult = await s3
        .listObjects({
          Bucket: process.env.S3_BUCKET_NAME,
        })
        .promise();

      // Sort objects by date in descending order
      const objects = listObjectsResult.Contents.sort(
        (a, b) => b.LastModified.getTime() - a.LastModified.getTime()
      );

      // Delete oldest objects if the backup limit has been reached
      if (objects.length > 15) {
        const objectsToDelete = objects.slice(15);
        for (const obj of objectsToDelete) {
          await s3
            .deleteObject({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: obj.Key,
            })
            .promise();
          console.log(`Deleted backup from S3: ${obj.Key}`);
        }
      }

      await client.end();
    }
  );

  setTimeout(backup, 1000 * 60 * 60 * 24);
}

export default backup;

import fs from 'fs-extra';
import moment from 'moment';
import { Client, ClientConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const backupDir = 'backups';

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} = process.env;

const connectionOptions = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

console.log('connectionOptions', connectionOptions);


const pgClient = new Client(connectionOptions as ClientConfig);

const backup = async () => {
  try {
    // Obtener la fecha actual y darle el formato necesario
    const now = moment().format('YYYYMMDD.HHmmss');

    // Nombre del archivo de backup
    const filename = `${DB_DATABASE}-${now}.backup`;

    // Comando para crear el archivo de backup
    const backupCommand = `pg_dump -F c -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -f ${filename} ${DB_DATABASE}`;

    console.log(`Creating backup: ${backupCommand}`);

    // Ejecutar el comando para crear el archivo de backup
    await pgClient.connect();
    await pgClient.query(backupCommand);

    // Crear la carpeta de backups si no existe 
    await fs.ensureDir(backupDir);

    // Mover el archivo de backup a la carpeta correspondiente
    await fs.move(filename, `${backupDir}/${filename}`);

    console.log(`Backup successful: ${filename}`);
  } catch (err) {
    console.error('Backup failed:', err);
  } finally {
    await pgClient.end();
  }
};

export default backup;

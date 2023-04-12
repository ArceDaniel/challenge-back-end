import { DataSource } from "typeorm";
import { join } from "path";
import dotenv from "dotenv";
import { User, Event } from "../entities";

dotenv.config();

// Cargar las variables de entorno desde el archivo .env

// Definir la configuración de TypeORM
export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Event],

  // Sincronizar la base de datos con los modelos de entidades
  synchronize: true,
});

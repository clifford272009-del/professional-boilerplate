import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

const env = process.env as Record<string, any>;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST || "localhost",
    port: Number(env.DB_PORT) || 3306,
    username: env.DB_USER || "root",
    password: env.DB_PASSWORD || "",
    database: env.DB_NAME || "professional_boilerplate",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
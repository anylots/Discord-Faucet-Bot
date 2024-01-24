import { DataSource } from "typeorm";

import { database } from "../config/config.json";
import { NonceCoolDown } from "./noncecooldown";
import { UserCoolDown } from "./usercooldown";
import "reflect-metadata";

export const Source = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: database.database,
	synchronize: true,
	logging: false,
	entities: [UserCoolDown, NonceCoolDown],
	subscribers: [],
	migrations: [],
});

import { Pool } from "pg";
import dotenv from 'dotenv';
import { envPath } from "../constants";
dotenv.config({
  path : envPath
}); 

export const pgPool = new Pool({
  database : process.env.DB_NAME || 'backend',
  port : parseInt(process.env.DB_PORT || '5432'),
  user : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  host : process.env.DB_HOST || 'localhost',
});
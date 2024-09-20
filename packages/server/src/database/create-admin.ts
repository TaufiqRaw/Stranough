import { Client } from 'pg';
import dotenv from 'dotenv';
import * as Constants from '../constants';
import path from 'path';
import * as fg from 'fast-glob';
import { rimraf } from 'rimraf';
import {hash} from 'bcrypt'
dotenv.config({
  path : Constants.envPath
})

const databaseName = process.env.DB_NAME ?? 'stranough';

const config = {
  port : parseInt(process.env.DB_PORT || '5432'),
  user : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  host : process.env.DB_HOST || 'localhost',
}
const client = new Client({
  ...config,
  database : databaseName,
});

async function main(){
  const password = await hash('password', 10);

  await client.connect();
  await client.query(`
    INSERT INTO "user" (username, email, password, created_at, updated_at, is_admin) VALUES ('admin', 'admin@example.com','${password}', NOW(), NOW(), true);
  `)
  await client.end();
}

main().catch(async err=>{
  console.error(err);
  await client.end();
  process.exit(1);
})
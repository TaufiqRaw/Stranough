import { Client } from 'pg';
import dotenv from 'dotenv';
import * as Constants from '../constants';
import path from 'path';
import * as fg from 'fast-glob';
import { rimraf } from 'rimraf';
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
const masterClient = new Client(config);
const client = new Client({
  ...config,
  database : databaseName,
});

async function main(){
  await masterClient.connect();
  await masterClient.query(`
    DROP DATABASE IF EXISTS ${databaseName};
  `)
  await masterClient.end();

  await fg.async(["src/database/migrations/*", "!src/database/migrations/Migration.init.ts"], {
    dot : true,
  }).then(async files=>files.map(async file=>{await rimraf(file)}))
}

main().catch(async err=>{
  console.error(err);
  await client.end();
  process.exit(1);
})
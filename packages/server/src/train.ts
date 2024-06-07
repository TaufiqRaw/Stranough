import OpenAI from 'openai';
import TrainData from './train-data.json';
import { envPath } from "./constants";
import dotenv from 'dotenv';
import { Client } from "pg";

dotenv.config({
  path : envPath
})

const openai = new OpenAI();
const client = new Client({
  database : process.env.DB_NAME || 'backend',
  port : parseInt(process.env.DB_PORT || '5432'),
  user : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  host : process.env.DB_HOST || 'localhost',
})

async function train(){
  await client.connect();
  try{
    client.query(`
      TRUNCATE TABLE intents;
    `)
  }catch(err){
    throw err;
  }
  const intents = TrainData.intents;
  for(const intentKey of Object.keys(intents)){
    for(const utterance of (intents[intentKey as keyof typeof intents])){
      const utteranceVector = await openai.embeddings.create({
        input : utterance,
        model : 'text-embedding-3-small'
      });
      try{
        await client.query(`
          INSERT INTO intents (intent, utterance)
          VALUES ($1, $2)
        `, [intentKey, JSON.stringify(utteranceVector.data[0].embedding)])
      }catch(err){
        throw err;
      }
    }
  }
  await client.end();
  console.log('Training complete');
}

train().then(() => process.exit(0)).catch(async (err) => {
  await client.end();
  console.error(err);
  process.exit(1);
});
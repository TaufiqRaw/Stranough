import OpenAI from "openai";
import * as dotenv from "dotenv";
import { envPath } from "../constants";
import { UserIntent } from "../interfaces/chatbot.interface";
import { pgPool } from "../utils/pg-pool";

dotenv.config({
  path : envPath
})

const openai = new OpenAI();

export namespace IntentClassifierService {
  export async function classify(s : string) : Promise<{intent : UserIntent, distance : number, embedding : number[]} | undefined>{
    const client = await pgPool!.connect();
    try{
      const utteranceVector = await openai.embeddings.create({
        input : s,
        model : 'text-embedding-3-small'
      });
      const embeddedUserInput = utteranceVector.data[0].embedding;
      const res = await client.query(`
        SELECT intent, utterance <-> $1 as distance 
        FROM intents 
        ORDER BY utterance <-> $1
      `, [JSON.stringify(embeddedUserInput)]);

      client.release();

      if(res.rowCount === 0){
        return undefined;
      }

      return {intent : res.rows[0].intent, distance : res.rows[0].distance, embedding : embeddedUserInput};
    }catch(err){
      client.release();
      throw err;
    }
  }

  export async function createEmbedding(s : string) : Promise<number[]>{
    try{
      const utteranceVector = await openai.embeddings.create({
        input : s,
        model : 'text-embedding-3-small'
      });
      return utteranceVector.data[0].embedding;
    }catch(err){
      throw err;
    }
  }
}
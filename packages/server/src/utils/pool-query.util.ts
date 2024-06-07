import { QueryConfig, QueryConfigValues } from "pg";
import { DI } from "../app";
import { pgPool } from "./pg-pool";

export async function poolQuery<T = any[]>(queryTextOrConfig: string | QueryConfig<T>,values?: QueryConfigValues<T>){
  const client = await pgPool.connect();
  let res;
  try{
    res = await client.query(queryTextOrConfig, values);
    client.release();
  }catch(err){
    client.release();
    throw err;
  }
  return res;
}
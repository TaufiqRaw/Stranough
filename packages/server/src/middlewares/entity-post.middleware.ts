import { Request, RequestHandler, Response } from "express";
import { BaseEntity } from "../entities";
import asyncMiddleware from "middleware-async";
import { DI } from "../app";

export function entityPostMiddleware<T extends BaseEntity>(
  entityMaker : (req : Request)=>(Promise<T> | T)
) : RequestHandler{
  return asyncMiddleware(async(req,res)=>{
    const newItem = await entityMaker(req);
    await DI.em.persistAndFlush(newItem);
    return res.json(newItem);
  })
}
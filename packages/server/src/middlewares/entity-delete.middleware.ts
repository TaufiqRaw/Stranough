import { EntityRepository } from "@mikro-orm/postgresql";
import asyncMiddleware from "middleware-async";
import { BaseEntity } from "../entities";
import { findOneEntity } from "../utils/find-one-entity.util";
import { BadRequestError } from "../utils/classes/error.class.util";
import { DI } from "../app";

export function entityDeleteMiddleware<T extends BaseEntity>(repository : ()=>EntityRepository<T>){
  return asyncMiddleware(async(req,res)=>{ 
    const repo = repository();
    const id = parseInt(req.params.id);
    const item = await findOneEntity(repo, id);
    if(!item)
      throw new BadRequestError('item not found');
    await DI.em.removeAndFlush(item);
    return res.json('ok');
  })
}
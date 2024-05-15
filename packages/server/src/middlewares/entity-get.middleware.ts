import asyncMiddleware from "middleware-async";
import { BaseEntity } from "../entities";
import { findOneEntity } from "../utils/find-one-entity.util";
import { EntityRepository, FindOneOptions, NotFoundError } from "@mikro-orm/postgresql";

export function entityGetMiddleware<T extends BaseEntity>(repository : ()=>EntityRepository<T>, options? : FindOneOptions<T>){
  return asyncMiddleware(async(req,res)=>{
    const id = parseInt(req.params.id);
    
    const item = await findOneEntity(repository(), id, options);
    
    if (item == undefined) throw new NotFoundError('Item not found');
  
    return res.json(item);
  })
}
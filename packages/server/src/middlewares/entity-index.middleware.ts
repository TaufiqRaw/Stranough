import { EntityRepository, Loaded } from "@mikro-orm/postgresql";
import asyncMiddleware from "middleware-async"
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { validatePaginationMiddleware } from "./validate-pagination.middleware";
import { BaseEntity } from "../entities";
import { RequestHandler } from "express";

export function entityIndexMiddleware<T extends BaseEntity>(
  repository : ()=>EntityRepository<T>,
  searchField : string,
  options ?: {
    populate?: string[],
    each ?: (entity : T)=>Promise<void>,
  }
) : RequestHandler[] 
{
  return [validatePaginationMiddleware, asyncMiddleware(async(req,res)=>{
    const repo = repository();
    const pagination = getPagination(req);
    //TODO: sanitize query
    const q  = req.query.q
    const searchQuery : any = q ? {
      [searchField] : {
         $like : `%${q}%`
       }
     } : undefined;

    const result = await findAndPaginateEntity(repo, pagination, searchQuery, {populate : options?.populate as never[]});
    if(options?.each){
      await Promise.all((result[0] as T[]).map(options.each))
    }
    return res.json(
      result
    )
  })]
}

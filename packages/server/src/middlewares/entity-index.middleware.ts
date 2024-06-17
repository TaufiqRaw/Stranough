import { EntityRepository, FilterQuery, Loaded } from "@mikro-orm/postgresql";
import asyncMiddleware from "middleware-async"
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { validatePaginationMiddleware } from "./validate-pagination.middleware";
import { BaseEntity } from "../entities";
import { RequestHandler } from "express";
import { deleteUndefined } from "../utils/delete-undefined.util";

export function entityIndexMiddleware<T extends BaseEntity>(
  repository : ()=>EntityRepository<T>,
  searchField : string,
  options ?: {
    queryMapper ?: (query : any)=>FilterQuery<T>,
    populate?: string[],
    each ?: (entity : T)=>Promise<void>,
  }
) : RequestHandler[] 
{
  return [validatePaginationMiddleware, asyncMiddleware(async(req,res)=>{
    const repo = repository();
    const pagination = getPagination(req);
    const query = {} as FilterQuery<T>;
    //TODO: sanitize query
    const q  = req.query.q
    if(q){
      //@ts-ignore
      query[searchField] = {
        $like : `%${q}%`
      }
    }

    if(options?.queryMapper)
      Object.assign(query, deleteUndefined(options.queryMapper(req.query)))

    const result = await findAndPaginateEntity(repo, pagination, query, {populate : options?.populate as never[]});
    if(options?.each){
      await Promise.all((result[0] as T[]).map(options.each))
    }
    return res.json(
      result
    )
  })]
}

import { EntityRepository } from "@mikro-orm/postgresql";
import asyncMiddleware from "middleware-async"
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { validatePaginationMiddleware } from "./validate-pagination.middleware";
import { BaseEntity } from "../entities";
import { RequestHandler } from "express";

export function entityIndexMiddleware<T extends BaseEntity>(repository : ()=>EntityRepository<T>) : RequestHandler[] 
{
  return [validatePaginationMiddleware, asyncMiddleware(async(req,res)=>{
    const repo = repository();
    const pagination = getPagination(req);
    const result = await findAndPaginateEntity(repo, pagination);
    return res.json(
      result
    )
  })]
}

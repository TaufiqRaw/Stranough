import { NextFunction, Request, Response } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { BadRequestError } from "../utils/classes/error.class.util";

export function validatePaginationMiddleware(req : Request, res : Response, next : NextFunction){
  const value = getPagination(req); 
  if((value.limit < 1 || value.page < 1))
    return next(new BadRequestError("Pagination values must be greater than 0"))
  return next();
}
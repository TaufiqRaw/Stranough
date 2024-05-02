import { Request } from "express";

export function getPagination(req : Request){
  const {page, limit} = req.query;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string)
  return {
    page : parsedPage ? parsedPage : 1,
    limit : parsedLimit ? parsedLimit : 10,
  }
}
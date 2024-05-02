import { NextFunction, Request, Response } from "express";

import { RequestContext } from "@mikro-orm/core";
import { DI } from "./app";
import { Class } from "./interfaces/class.interface";
import { ExpressError } from "./utils/classes/error.class.util";

export function createRequestContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  RequestContext.create(DI.orm.em, next);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  DI.logger.error(`${err.message}\n stack : ${err.stack}`);

  if (err instanceof ExpressError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack,
      context: err.context,
    });
  }
  
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
}

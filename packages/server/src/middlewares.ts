import { NextFunction, Request, Response } from "express";

import { RequestContext } from "@mikro-orm/core";
import { DI } from "./app";
import { Class } from "./interfaces/class.interface";
import { ExpressError } from "./utils/classes/error.class.util";
import multer from "multer";
import { imageSizeLimit } from "./constants";

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
  
  if (err instanceof ExpressError) {
    if(err.statusCode === 500) DI.logger.error(`${err.message} -- stack : ${err.stack}`);
    else DI.logger.debug(`${err.message} -- stack : ${err.stack}`);

    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack,
      context: err.context,
    });
  }
  
  DI.logger.error(`${err.message} -- stack : ${err.stack}`);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
}

export async function multerUpload(req: Request, res: Response, next: NextFunction) {
  try {
      await new Promise<void>((resolve, reject) => {
          multer({ storage: multer.memoryStorage(), limits : {fileSize : imageSizeLimit}})
          .single('file')(req, res, (err) => {
            if (err) return reject(err);

              return resolve();
          })
      });

      next();
  } catch (error) {
      next(error);
  }
}
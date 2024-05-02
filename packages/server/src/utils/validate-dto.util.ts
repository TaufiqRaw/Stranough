import { validateOrReject, validate  } from "class-validator";
import { Class } from "../interfaces/class.interface";
import { BadRequestError } from "./classes/error.class.util";
import {plainToClass} from "class-transformer";
import { Request } from "express";

export async function validateDto<T extends Object>(req : Request ,className : Class<T>){
  const data = req.body;
  const instance = plainToClass(className, data, {excludeExtraneousValues : true});

  const errors = await validate(instance);
  if(errors.length > 0){
    const messages = errors.map((error) => error.constraints?.[Object.keys(error.constraints)[0]] || 'Unknown Error');
    throw new BadRequestError(messages);
  }

  return instance;
}
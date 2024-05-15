import { validateOrReject, validate, ValidationError  } from "class-validator";
import { Class } from "../interfaces/class.interface";
import { BadRequestError } from "./classes/error.class.util";
import {ClassTransformOptions, plainToClass, plainToInstance} from "class-transformer";
import { Request } from "express";

export async function validateDto<T extends Object>(req : Request ,className : Class<T>, options? : ClassTransformOptions){
  const data = req.body;
  const instance = plainToInstance(className, data, {...options,excludeExtraneousValues : true});

  const errors = await validate(instance);
  if(errors.length > 0){
    const messages = errors.map((error) => getErrorRecursive(error)).map((error)=>Object.values(error)).flat(3);
    throw new BadRequestError(messages as string[]);
  }

  return instance;
}

function getErrorRecursive(errors : ValidationError):any{
  if(errors?.children?.length === 0){
    return errors.constraints;
  }
  return errors?.children?.map(getErrorRecursive);
}
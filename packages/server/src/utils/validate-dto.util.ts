import { validateOrReject, validate, ValidationError, ValidatorOptions  } from "class-validator";
import { Class } from "../interfaces/class.interface";
import { BadRequestError } from "./classes/error.class.util";
import {plainToClass, plainToInstance} from "class-transformer";
import { Request } from "express";
import { deleteUndefined } from "./delete-undefined.util";
import * as Constants from "../constants";
require('dotenv').config({
  path : Constants.envPath
});

export async function validateDto<T extends Object>(req : Request ,className : Class<T>, options? : ValidatorOptions){
  const data = req.body;
  const instance = plainToInstance(className, data, {excludeExtraneousValues : true});

  const errors = await validate(instance, options);
  if(errors.length > 0){
    const messages = errors.map((error) => getErrorRecursive(error)).map((error)=>Object.values(error)).flat(3);
    throw new BadRequestError(messages as string[]);
  }

  return deleteUndefined(instance);
}

function getErrorRecursive(errors : ValidationError):any{
  if(errors?.children?.length === 0){
    return errors.constraints;
  }
  return errors?.children?.map(getErrorRecursive);
}
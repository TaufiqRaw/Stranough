import { EntityRepository } from "@mikro-orm/postgresql";
import { BaseEntity } from "../entities/base.entity";
import { findOneEntity } from "./find-one-entity.util";

type PrimaryKeyObject = {
  [key : string] : number | undefined
}

/**
 * find multiple entities by their primary keys
 * @param repo this is the repository of the entity you want to find
 * @param primaryKeys this is an object that maps the string key (will be used in return object) to the primary key of the entity (number)
 * @returns an object that maps the string key to the entity
 */
export async function findEachEntity<T extends BaseEntity>(repo : EntityRepository<T>, primaryKeys : PrimaryKeyObject){
  const result = {} as {
    [key in keyof PrimaryKeyObject] : T | undefined
  }

  for(const key in primaryKeys){
    result[key] = await findOneEntity(repo, primaryKeys[key]);
  }

  return result;
}
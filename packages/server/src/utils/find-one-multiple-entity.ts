import { EntityRepository } from "@mikro-orm/postgresql";
import { BaseEntity } from "../entities/base.entity";
import { findOneEntity } from "./find-one-entity.util";

type PrimaryKeyObject<T> = {
  [key in keyof T] : number | undefined | null
}

/**
 * find multiple entities by their primary keys
 * @param repo this is the repository of the entity you want to find
 * @param primaryKeys this is an object that maps the string key (will be used in return object) to the primary key of the entity (number)
 * @returns an object that maps the string key to the entity
 */
export async function findEachEntity<T extends BaseEntity, U>(repo : EntityRepository<T>, primaryKeys : PrimaryKeyObject<U>) : Promise<{
  [key in keyof PrimaryKeyObject<U>] : T | undefined
}>{
  const result = {} as {
    [key in keyof PrimaryKeyObject<U>] : T | undefined
  };

  for(const key in primaryKeys){
    const v = primaryKeys[key];
    if(!v){
      result[key] = undefined;
      continue;
    }
    result[key] = await findOneEntity(repo, v);
  }

  return result;
}
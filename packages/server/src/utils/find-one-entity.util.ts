import { EntityRepository, FilterQuery, FindOneOptions } from "@mikro-orm/postgresql";
import { BaseEntity } from "../entities/base.entity";

export async function findOneEntity<T extends BaseEntity>(
  repo: EntityRepository<T>,
  where?: (FilterQuery<T> | number),
  options? : FindOneOptions<T>
) {
  if(where == null)
    return undefined;
  
  let result;
  if(typeof where === 'number')
    result = await repo.findOne({$eq : {id : where}} as FilterQuery<T>, options);
  else
    result = await repo.findOne(where, options);

  if(result == null)
    return undefined;
  return result;
}
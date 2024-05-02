import { EntityRepository, FilterQuery, FindOptions, QueryFlag } from "@mikro-orm/postgresql";
import { PaginationQueryType } from "../interfaces/pagination.interface";
import { BaseEntity } from "../entities/base.entity";

interface findAndPaginateOption<T> extends Omit<FindOptions<T, never>, 'offset' | 'limit' | 'flags'> {}

export async function findAndPaginateEntity<T extends BaseEntity>(repo : EntityRepository<T>, pagination : PaginationQueryType, where : FilterQuery<T> = {}, options ?: findAndPaginateOption<T>){
  const {limit,page} = pagination;
  return await repo.findAndCount(where, {
    offset : (page - 1 ) * limit,
    limit,
    flags : [QueryFlag.PAGINATE],
    //@ts-ignore
    orderBy : { createdAt : QueryOrder.DESC },
    ...options
  })
}
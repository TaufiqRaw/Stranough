import asyncMiddleware from "middleware-async";
import { BaseEntity } from "../entities";
import { findOneEntity } from "../utils/find-one-entity.util";
import { EntityRepository, FindOneOptions } from "@mikro-orm/postgresql";
import { NotFoundError } from "../utils/classes/error.class.util";

export function entityGetMiddleware<T extends BaseEntity>(
  repository: () => EntityRepository<T>,
  _options?: FindOneOptions<T> & { itemCallback?: (item: T) => Promise<T> }
) {
  return asyncMiddleware(async (req, res) => {
    const id = parseInt(req.params.id);

    const { itemCallback, ...options } = _options ?? {};

    const item = await findOneEntity(
      repository(),
      id,
      options as FindOneOptions<T>
    );

    if (item == undefined) throw new NotFoundError();

    if (itemCallback) {
      const newItem = await itemCallback(item);
      return res.json(newItem);
    }

    return res.json(item);
  });
}

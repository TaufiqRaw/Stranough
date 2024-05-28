import { Router } from "express";
import { validatePaginationMiddleware } from "../middlewares/validate-pagination.middleware";
import asyncMiddleware from "middleware-async";
import { getPagination } from "./get-pagination.util";
import { findAndPaginateEntity } from "./find-and-paginate-entity.util";
import { EntityRepository, Populate } from "@mikro-orm/postgresql";
import { DI } from "../app";
import { Class } from "utility-types";
import { validateDto } from "./validate-dto.util";
import { BaseEntityWithSprite } from "../entities";
import { BadRequestError } from "./classes/error.class.util";
import { findOneEntity } from "./find-one-entity.util";
import { entityIndexMiddleware } from "../middlewares/entity-index.middleware";
import { entityPostMiddleware } from "../middlewares/entity-post.middleware";
import { entityDeleteMiddleware } from "../middlewares/entity-delete.middleware";
import { BaseEntityWithSpriteDto } from "../dtos/base-entity-with-sprite.dto";
import { entityGetMiddleware } from "../middlewares/entity-get.middleware";

export function entityWithSpriteRouterFactory<T extends BaseEntityWithSprite, U extends BaseEntityWithSpriteDto>(repository : ()=>EntityRepository<T>, dto : Class<U>){
  const router = Router();
  router.get('/', entityIndexMiddleware(repository, 'name'))

  router.get('/:id', entityGetMiddleware(repository, {
    populate : (['thumbnail', 'texture'] as any),
  }))

  router.post('/', entityPostMiddleware(async (req)=>{
    const repo = repository();
    const {thumbnail, texture,...reqBody} = await validateDto(req, dto, {groups : ['create']});
    const thumbnailMedia = thumbnail ? await findOneEntity(DI.repository.medias, thumbnail) : undefined;
    const textureMedia = texture ? await findOneEntity(DI.repository.medias, texture) : undefined;
  
    //@ts-ignore
    return repo.create({...reqBody, thumbnail: thumbnailMedia, texture: textureMedia});
  }))

  router.put('/:id', asyncMiddleware(async(req,res)=>{
    const repo = repository();
    const reqBody = await validateDto(req, dto, {groups : ['update']});

    const id = parseInt(req.params.id);
    if(isNaN(id))
      throw new BadRequestError('invalid id');

    const item = await findOneEntity(repo, id);
    if(!item)
      throw new BadRequestError('item not found');
  
    Object.assign(item, reqBody);
  
    await DI.em.flush();
  
    return res.json(item);
  }))

  router.delete('/:id', entityDeleteMiddleware(repository, {
    async itemCallback(item) {
      await item.loadMedias();
    },
  }))

  return router;
}
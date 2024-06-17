import { Router } from "express";
import { validatePaginationMiddleware } from "../middlewares/validate-pagination.middleware";
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { DI } from "../app";
import { validateDto } from "../utils/validate-dto.util";
import { ElectricGuitarModel } from "../entities/electric-guitar-model.entity";
import { findOneEntity } from "../utils/find-one-entity.util";
import {
  BadRequestError,
  NotFoundError,
} from "../utils/classes/error.class.util";
import { GuitarBody } from "../entities/guitar-body.entity";
import { GuitarBodyContour } from "../entities/guitar-body-contour.entity";
import { ElectricGuitarModelDto } from "../dtos/electric-guitar-model.dto";
import asyncMiddleware from "middleware-async";
import { findEachEntity } from "../utils/find-one-multiple-entity";
import * as R from "remeda";
import { GuitarBodyDto } from "../dtos/guitar-body.dto";
import { entityIndexMiddleware } from "../middlewares/entity-index.middleware";
import { entityPostMiddleware } from "../middlewares/entity-post.middleware";
import { entityGetMiddleware } from "../middlewares/entity-get.middleware";
import { entityDeleteMiddleware } from "../middlewares/entity-delete.middleware";
import { GuitarBodyContourDto } from "../dtos";
import { ref } from "@mikro-orm/core";
import * as Common from 'stranough-common';

function bodyMediaKeysToObject(req : {[k in typeof GuitarBody.mediaKeys[number]] ?: number | null}){
  return GuitarBody.mediaKeys.reduce((acc, key)=>{
    acc[key] = req[key];
    return acc;
  }, {} as {[k in typeof GuitarBody.mediaKeys[number]] ?: number | null})
}

function textureMediaKeysToObject(req : {[k in typeof GuitarBodyContour.mediaKeys[number]] ?: number | null}){
  return GuitarBodyContour.mediaKeys.reduce((acc, key)=>{
    acc[key] = req[key];
    return acc;
  }, {} as {[k in typeof GuitarBodyContour.mediaKeys[number]] ?: number | null})
}

// ---------------------------- ROUTER ------------------------------- //

export const router = Router();

router.get(
  "/",
  entityIndexMiddleware(() => DI.repository.electricModels, "name", {
    populate : ["thumbnail"]
  })
);

router.get(
  "/deep",
  entityIndexMiddleware(() => DI.repository.electricModels, "name", {
    each : async (model)=>{
      await model.deepLoadBodies();
    }
  })
);

// TODO: posting use guitar model dto and do initialization like in put method instead
router.post(
  "/",
  entityPostMiddleware(async (req) => {
    const reqData = await validateDto(req, ElectricGuitarModelDto, {
      groups: ["create"],
    });

    // @ts-ignore
    const model = new ElectricGuitarModel({
      ...reqData,
      ...R.pick(reqData, Common.GuitarModel.spawnPointKeys),
    });

    /**
     * relevant data ----------
     * model = {
     *  *Body : GuitarBody {
     *    *Texture : GuitarBodyTexture {
     *     *Mask : Media,
     *     *Texture : Media
     * ------------------------
     */

    for (let bodyKey of Common.GuitarModel.bodyKeys) {
      const reqBody = reqData[bodyKey];
      if (!!reqBody) {
        // if the body data exists in the request, create it
        const body = await createAndAddBody(model, reqBody, bodyKey);
        for (let textureKey of Common.GuitarBody.contourKeys) {
          const reqBodyTexture = reqBody[textureKey] as GuitarBodyContourDto;
          if (!!reqBodyTexture) {
            // if the texture data exists in the request, create it
            await createAndAddBodyTexture(body, reqBodyTexture, textureKey);
          } else {
            // if the texture data doesn't exist in the request, do nothing
          }
        }
      } else {
        // if the body data doesn't exist in the request, do nothing
      }
    }

    return model;
  })
);

router.get(
  "/:id",
  entityGetMiddleware(() => DI.repository.electricModels, {
    itemCallback : async (item)=>{
      await item.deepLoadBodies();
      return item;
    }
  })
);

router.delete(
  "/:id",
  entityDeleteMiddleware(() => DI.repository.electricModels, {
    itemCallback : async (item)=>{
      await item.loadBodies();
      for(const bodyKey of Common.GuitarModel.bodyKeys){
        const body = item[bodyKey] as GuitarBody;
        if(!!body){
          await body.loadTextures();
          for(const textureKey of Common.GuitarBody.contourKeys){
            await body[textureKey]?.loadMedias();
          }
        }
      }
    }
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const reqData = await validateDto(req, ElectricGuitarModelDto, {
      groups: ["update"],
    });

    const id = parseInt(req.params.id);
    if(isNaN(id)) throw new BadRequestError("Invalid id");

    const model = await findOneEntity(DI.repository.electricModels, id);
    if (model == undefined) throw new BadRequestError("Model not found");

    /**
     * relevant data ----------
     * model = {
     *  *Body : GuitarBody {
     *    *Texture : GuitarBodyTexture {
     *     *Mask : Media,
     *     *Texture : Media
     * ------------------------
     */


    // update the model
    if(reqData.thumbnail === null && model.thumbnail){
      DI.em.remove(model.thumbnail);
    }
    if (!!reqData.thumbnail) {
      const newThumb = await findOneEntity(
        DI.repository.medias,
        reqData.thumbnail
      );
      newThumb && (model.thumbnail = ref(newThumb));
    }
    const reqDataNonRelational = R.pipe(
      reqData,
      R.omit([...Common.GuitarModel.bodyKeys, ...ElectricGuitarModel.mediaKeys])
    );

    Object.assign(model, reqDataNonRelational);

    //TODO: delete the old item if request === null
    await model.deepLoadBodies();

    for (let bodyKey of Common.GuitarModel.bodyKeys) {
      const guitarBody = model[bodyKey] as GuitarBody;
      if (!!guitarBody) {
        // if the body exists in the model, update it
        const reqGuitarBody = reqData[bodyKey] as GuitarBodyDto;
        if (!!reqGuitarBody) {
          // if the body data exists in the request, update it
          const medias = await findEachEntity(DI.repository.medias, bodyMediaKeysToObject(reqGuitarBody));
          // remove the old media if the new one is null
          for(const media in bodyMediaKeysToObject(reqGuitarBody)){
            if(bodyMediaKeysToObject(reqGuitarBody)[media as typeof GuitarBody.mediaKeys[number]] === null){
              const rm = await model[bodyKey]?.[media as typeof GuitarBody.mediaKeys[number]]?.load();
              rm && DI.em.remove(rm);
            }
          }
          Object.assign(guitarBody, {
            ...medias,
            ...R.omit(reqGuitarBody, [...Common.GuitarBody.contourKeys, ...GuitarBody.mediaKeys])
          });
          for (let textureKey of Common.GuitarBody.contourKeys) {
            const reqBodyTexture = reqGuitarBody[
              textureKey
            ] as GuitarBodyContourDto;
            if (!!reqBodyTexture) {
              // if the texture data exists in the request, update it
              if (!!(guitarBody as GuitarBody)[textureKey]) {
                // if the texture exists in the body, update it
                if (!!reqBodyTexture) {
                  const loadedReqBodyTextureMedia = await findEachEntity(
                    DI.repository.medias,
                    textureMediaKeysToObject(reqBodyTexture)
                  );
                  // remove the old media if the new one is null
                  for(const media in textureMediaKeysToObject(reqBodyTexture)){
                    if(textureMediaKeysToObject(reqBodyTexture)[media as typeof GuitarBodyContour.mediaKeys[number]] === null){
                      const rm = await model[bodyKey]?.[textureKey]?.[media as typeof GuitarBodyContour.mediaKeys[number]]?.load();
                      rm && DI.em.remove(rm);
                    }
                  }
                  // if the texture data exists in the request, update it
                  Object.assign(guitarBody[textureKey] as GuitarBodyContour, {
                    ...R.omit(reqBodyTexture, GuitarBodyContour.mediaKeys),
                    ...loadedReqBodyTextureMedia,
                  });
                } else {
                  // if the texture data doesn't exist in the request, do nothing
                }
              } else {
                // if the texture doesn't exist in the body, create it
                if (!!reqBodyTexture) {
                  // if the texture data exists in the request, create it
                  await createAndAddBodyTexture(
                    guitarBody,
                    reqBodyTexture,
                    textureKey
                  );
                } else {
                  // if the texture data doesn't exist in the request, do nothing
                }
              }
            } else {
              // if the texture data doesn't exist in the request, do nothing
            }
          }
        } else {
          // if the body data doesn't exist in the request, do nothing
        }
      } else {
        // if the body doesn't exist in the model, create it
        const reqGuitarBody = reqData[bodyKey] as GuitarBodyDto;
        if (!!reqGuitarBody) {
          // if the body data exists in the request, create it
          const body = await createAndAddBody(model, reqGuitarBody, bodyKey);
          for (let textureKey of Common.GuitarBody.contourKeys) {
            const reqBodyTexture = reqGuitarBody[
              textureKey
            ] as GuitarBodyContourDto;
            if (!!reqBodyTexture) {
              // if the texture data exists in the request, create it
              await createAndAddBodyTexture(body, reqBodyTexture, textureKey);
            } else {
              // if the texture data doesn't exist in the request, do nothing
            }
          }
        } else {
          // if the body data doesn't exist in the request, do nothing
        }
      }
    }

    await DI.em.flush();

    return res.send("ok");
  })
);

// ------------------ helper functions ------------------ //

async function createAndAddBody(
  model: ElectricGuitarModel,
  reqGuitarBody: GuitarBodyDto,
  bodyKey: typeof Common.GuitarModel.bodyKeys[number]
) {
  await model.loadBodies();
  const bodySetKey = `set${bodyKey.replace(/^\w/, (c) => c.toUpperCase())}` as
    | `set${Capitalize<typeof Common.GuitarModel.bodyKeys[number]>}`
  
  const medias = await findEachEntity(DI.repository.medias, bodyMediaKeysToObject(reqGuitarBody));

  const body = new GuitarBody({
    ...medias,
    ...R.omit(reqGuitarBody, [...GuitarBody.mediaKeys, ...Common.GuitarBody.contourKeys]),
  });
  await model[bodySetKey](body);
  DI.em.persist(body);
  return body;
}

async function createAndAddBodyTexture(
  body: GuitarBody,
  reqBodyTexture: GuitarBodyContourDto,
  textureKey: typeof Common.GuitarBody.contourKeys[number]
) {
  await body.loadTextures();
  const loadedReqBodyTextureMedia = await findEachEntity(DI.repository.medias, 
    textureMediaKeysToObject(reqBodyTexture)
  )
  const { ..._ } = reqBodyTexture;
  const newTexture = new GuitarBodyContour({
    ...loadedReqBodyTextureMedia,
  });
  const textureSetKey = `set${textureKey.replace(/^\w/, (c) =>
    c.toUpperCase()
  )}` as `set${Capitalize<typeof Common.GuitarBody.contourKeys[number]>}`;
  await body[textureSetKey](newTexture);
  DI.em.persist(newTexture);
  return newTexture;
}

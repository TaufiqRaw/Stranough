import { Router } from "express";
import { validatePaginationMiddleware } from "../middlewares/validate-pagination.middleware";
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { DI } from "../app";
import { validateDto } from "../utils/validate-dto.util";
import { GuitarModel } from "../entities/guitar-model.entity";
import { findOneEntity } from "../utils/find-one-entity.util";
import {
  BadRequestError,
  NotFoundError,
} from "../utils/classes/error.class.util";
import { GuitarBody } from "../entities/guitar-body.entity";
import { GuitarBodyTexture } from "../entities/guitar-body-texture.entity";
import { GuitarModelDto } from "../dtos/guitar-model.dto";
import asyncMiddleware from "middleware-async";
import { findEachEntity } from "../utils/find-one-multiple-entity";
import * as R from "remeda";
import { GuitarBodyDto } from "../dtos/guitar-body.dto";
import { GuitarBodyTextureDto } from "../dtos";
import { entityIndexMiddleware } from "../middlewares/entity-index.middleware";
import { entityPostMiddleware } from "../middlewares/entity-post.middleware";
import { entityGetMiddleware } from "../middlewares/entity-get.middleware";
import { entityDeleteMiddleware } from "../middlewares/entity-delete.middleware";
import {
  bodyTexturesKey,
  modelBodiesKey,
  textureMediasKey,
} from "../constants";
import { GuitarBodyTextureType, GuitarBodyType } from "../enums";

const modelSpawnPointKeys = Object.freeze([
  "knobSpawnPoint",
  "bridgeSpawnPoint",
  "pickupSpawnPoint",
  "switchSpawnPoint",
  "topJackSpawnPoint",
  "sideJackSpawnPoint",
  "fingerboardSpawnPoint",
] as const);

// eg: boltOnBody.carvedTopTexture
const bodyTextures = Object.freeze(
  modelBodiesKey.reduce((acc, body) => {
    bodyTexturesKey.forEach((texture) => {
      acc.push(`${body}.${texture}`);
    });
    return acc;
  }, [] as string[])
);

// eg: boltOnBody.carvedTopTexture.frontHoleMask
const bodyTextureMedias = Object.freeze(
  bodyTextures.reduce((acc, bodyTexture) => {
    textureMediasKey.forEach((media) => {
      acc.push(`${bodyTexture}.${media}`);
    });
    return acc;
  }, [] as string[])
);

// ---------------------------- ROUTER ------------------------------- //

export const router = Router();

router.get(
  "/",
  entityIndexMiddleware(() => DI.repository.guitarModels, "name")
);

router.get(
  "/deep",
  entityIndexMiddleware(() => DI.repository.guitarModels, "name", {
    each : async (model)=>{
      await model.deepLoadBodies();
    }
  })
);

// TODO: posting use guitar model dto and do initialization like in put method instead
router.post(
  "/",
  entityPostMiddleware(async (req) => {
    const reqData = await validateDto(req, GuitarModelDto, {
      groups: ["create"],
    });

    const model = new GuitarModel({
      name: reqData.name!,
      description: reqData.description!,
      ...R.pick(reqData, modelSpawnPointKeys),
      thumbnail: await findOneEntity(DI.repository.medias, reqData.thumbnail),
      allowSingleCoilPickup: reqData.allowSingleCoilPickup,
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

    //TODO: delete the old item if request === null
    for (let bodyKey of modelBodiesKey) {
      const reqBody = reqData[bodyKey];
      if (!!reqBody) {
        // if the body data exists in the request, create it
        const body = await createAndAddBody(model, reqBody, bodyKey);
        for (let textureKey of bodyTexturesKey) {
          const reqBodyTexture = reqBody[textureKey] as GuitarBodyTextureDto;
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
  entityGetMiddleware(() => DI.repository.guitarModels, {
    itemCallback : async (item)=>{
      await item.deepLoadBodies();
      return item;
    }
  })
);

router.delete(
  "/:id",
  entityDeleteMiddleware(() => DI.repository.guitarModels, {
    itemCallback : async (item)=>{
      await item.loadBodies();
      for(const bodyKey of modelBodiesKey){
        const body = item[bodyKey] as GuitarBody;
        if(!!body){
          await body.loadTextures();
          for(const textureKey of bodyTexturesKey){
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
    const reqData = await validateDto(req, GuitarModelDto, {
      groups: ["update"],
    });

    const id = parseInt(req.params.id);
    if(isNaN(id)) throw new BadRequestError("Invalid id");

    const model = await findOneEntity(DI.repository.guitarModels, id);
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

    //TODO: delete the old item if request === null

    // update the model
    if (!!reqData.name) {
      model.name = reqData.name;
    }
    if (!!reqData.description) {
      model.description = reqData.description;
    }
    if (!!reqData.thumbnail) {
      model.thumbnail = await findOneEntity(
        DI.repository.medias,
        reqData.thumbnail
      );
    }

    if(!!reqData.allowSingleCoilPickup){
      model.allowSingleCoilPickup = reqData.allowSingleCoilPickup;
    }

    Object.assign(model, R.pick(reqData, modelSpawnPointKeys));

    await model.deepLoadBodies();

    for (let bodyKey of modelBodiesKey) {
      const guitarBody = model[bodyKey] as GuitarBody;
      if (!!guitarBody) {
        // if the body exists in the model, update it
        const reqGuitarBody = reqData[bodyKey] as GuitarBodyDto;
        if (!!reqGuitarBody) {
          // if the body data exists in the request, update it
          const medias = await findEachEntity(DI.repository.medias, {
            mask: reqGuitarBody.mask,
          });
          Object.assign(guitarBody, {
            mask: medias.mask,
            ...R.omit(reqGuitarBody, [...bodyTexturesKey, 'mask'])
          });
          for (let textureKey of bodyTexturesKey) {
            const reqBodyTexture = reqGuitarBody[
              textureKey
            ] as GuitarBodyTextureDto;
            if (!!reqBodyTexture) {
              // if the texture data exists in the request, update it
              if (!!(guitarBody as GuitarBody)[textureKey]) {
                // if the texture exists in the body, update it
                if (!!reqBodyTexture) {
                  const loadedReqBodyTextureMedia = await findEachEntity(
                    DI.repository.medias,
                    {
                      backMask: reqBodyTexture.backMask,
                      backShadowTexture: reqBodyTexture.backShadowTexture,
                      backSpecularTexture: reqBodyTexture.backSpecularTexture,
                      frontHoleMask: reqBodyTexture.frontHoleMask,
                      mask: reqBodyTexture.mask,
                      frontShadowTexture: reqBodyTexture.frontShadowTexture,
                      frontSpecularTexture: reqBodyTexture.frontSpecularTexture,
                    }
                  );
                  // if the texture data exists in the request, update it
                  Object.assign(guitarBody[textureKey] as GuitarBodyTexture, {
                    scale: reqBodyTexture.scale,
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
          for (let textureKey of bodyTexturesKey) {
            const reqBodyTexture = reqGuitarBody[
              textureKey
            ] as GuitarBodyTextureDto;
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
  model: GuitarModel,
  reqGuitarBody: GuitarBodyDto,
  bodyKey: GuitarBodyType
) {
  await model.loadBodies();
  const bodySetKey = `set${bodyKey.replace(/^\w/, (c) => c.toUpperCase())}` as
    | "setBoltOnBody"
    | "setSetInBody"
    | "setNeckThroughBody";
  
  const medias = await findEachEntity(DI.repository.medias, {
    mask: reqGuitarBody.mask,
  });
  const body = new GuitarBody({
    mask : medias.mask,
    ...R.omit(reqGuitarBody, ['mask', ...bodyTexturesKey]),
  });
  await model[bodySetKey](body);
  DI.em.persist(body);
  return body;
}

async function createAndAddBodyTexture(
  body: GuitarBody,
  reqBodyTexture: GuitarBodyTextureDto,
  textureKey: GuitarBodyTextureType
) {
  await body.loadTextures();
  const loadedReqBodyTextureMedia = await findEachEntity(DI.repository.medias, {
    backMask: reqBodyTexture.backMask,
    backShadowTexture: reqBodyTexture.backShadowTexture,
    backSpecularTexture: reqBodyTexture.backSpecularTexture,
    frontHoleMask: reqBodyTexture.frontHoleMask,
    mask: reqBodyTexture.mask,
    frontShadowTexture: reqBodyTexture.frontShadowTexture,
    frontSpecularTexture: reqBodyTexture.frontSpecularTexture,
  });
  const { scale, ..._ } = reqBodyTexture;
  const newTexture = new GuitarBodyTexture({
    ...loadedReqBodyTextureMedia,
    scale,
  });
  const textureSetKey = `set${textureKey.replace(/^\w/, (c) =>
    c.toUpperCase()
  )}` as
    | "setCarvedTopTexture"
    | "setTummyCutTexture"
    | "setForearmCutTexture"
    | "setFlatTopBackTexture"
    | "setCarvedTopBackTexture"
    | "setForearmTummyCutTexture"
    | "setCarvedTopTummyCutTexture";
  await body[textureSetKey](newTexture);
  DI.em.persist(newTexture);
  return newTexture;
}

import { Router } from "express";
import { validatePaginationMiddleware } from "../middlewares/validate-pagination.middleware";
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { DI } from "../app";
import { validateDto } from "../utils/validate-dto.util";
import { GuitarModel } from "../entities/guitar-model.entity";
import { findOneEntity } from "../utils/find-one-entity.util";
import { BadRequestError, NotFoundError } from "../utils/classes/error.class.util";
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
import { bodyTexturesKey, modelBodiesKey, textureMediasKey } from "../constants";

const bodySpawnPointKeys = Object.freeze(['knobSpawnPoint', 'bridgeSpawnPoint', 'pickupSpawnPoint', 'switchSpawnPoint', 'topJackSpawnPoint', 'sideJackSpawnPoint', 'fingerboardSpawnPoint'] as const);

// eg: boltOnBody.carvedTopTexture
const bodyTextures = Object.freeze(modelBodiesKey.reduce((acc, body)=>{
  bodyTexturesKey.forEach(texture=>{
    acc.push(`${body}.${texture}`);
  })
  return acc;
}, [] as string[]))

// eg: boltOnBody.carvedTopTexture.frontHoleMask
const bodyTextureMedias = Object.freeze(bodyTextures.reduce((acc, bodyTexture)=>{
  textureMediasKey.forEach(media=>{
    acc.push(`${bodyTexture}.${media}`);
  })
  return acc;
}, [] as string[]))

async function createBody(reqData : GuitarModelDto, model : GuitarModel, bodyKey : keyof GuitarModel & keyof GuitarModelDto){
  const reqGuitarBody = (reqData[bodyKey] as GuitarBodyDto);
  if(!!reqGuitarBody){
    // if the body data exists in the request, create it
    const reqGuitarBodySpawnPoints = R.pick(reqGuitarBody, bodySpawnPointKeys);
    const body = new GuitarBody({...reqGuitarBodySpawnPoints, model});
    // @ts-ignore
    model[bodyKey] = body;
    DI.em.persist(body);
    for(let textureKey of bodyTexturesKey){
      // create the body texture first
      const reqBodyTexture = (reqGuitarBody[textureKey] as GuitarBodyTextureDto);
      if(!!reqBodyTexture){
        // if the texture data exists in the request, create it
        const loadedReqBodyTextureMedia = await findEachEntity(DI.repository.medias, {
          backMask : reqBodyTexture.backMask,
          backShadowTexture : reqBodyTexture.backShadowTexture,
          backSpecularTexture : reqBodyTexture.backSpecularTexture,
          frontHoleMask : reqBodyTexture.frontHoleMask,
          mask : reqBodyTexture.mask,
          frontShadowTexture : reqBodyTexture.frontShadowTexture,
          frontSpecularTexture : reqBodyTexture.frontSpecularTexture,
        })
        const {scale,..._} = (reqGuitarBody[textureKey] as GuitarBodyTextureDto);
        const newTexture = new GuitarBodyTexture({ ...loadedReqBodyTextureMedia ,scale, body});
        // @ts-ignore
        body[textureKey] = newTexture;
        DI.em.persist(newTexture);
      }else{
        // if the texture data doesn't exist in the request, do nothing
      }
    }
  }else{
    // if the body data doesn't exist in the request, do nothing
  }
}


// ----------------------------- ROUTER ----------------------------- //

export const router = Router();

router.get('/', entityIndexMiddleware(()=>DI.repository.guitarModels));

// TODO: posting use guitar model dto and do initialization like in put method instead
router.post('/', entityPostMiddleware(async (req)=>{
  const reqData = await validateDto(req, GuitarModelDto, {groups : ['create']});

  const model = new GuitarModel({
    name : reqData.name,
    description : reqData.description,
    thumbnail : await findOneEntity(DI.repository.medias, reqData.thumbnail)
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

    for(let bodyKey of modelBodiesKey){
      await createBody(reqData, model, bodyKey);
    }
  
  return model;
}))

router.get('/:id', entityGetMiddleware(()=>DI.repository.guitarModels, {
  populate : [ ...modelBodiesKey, ...bodyTextures, ...bodyTextureMedias] as any
}))

router.delete('/:id', entityDeleteMiddleware(()=>DI.repository.guitarModels));

router.put('/:id', asyncMiddleware(async(req,res)=>{
  const reqData = await validateDto(req, GuitarModelDto, {groups : ['update']});

  const id = parseInt(req.params.id);
  const model = await findOneEntity(DI.repository.guitarModels, id, {
    populate : [ ...modelBodiesKey, ...bodyTextures, ...bodyTextureMedias] as any
  });
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
  
  if(!!reqData.name){
    model.name = reqData.name;
  }
  if(!!reqData.description){
    model.description = reqData.description;
  }
  if(!!reqData.thumbnail){
    model.thumbnail = await findOneEntity(DI.repository.medias, reqData.thumbnail);
  }

  for(let bodyKey of modelBodiesKey){
    const guitarBody = model[bodyKey] as GuitarBody;
    if(!!guitarBody){
      // if the body exists in the model, update it
      const reqGuitarBody = (reqData[bodyKey] as GuitarBodyDto);
      if(!!reqGuitarBody){
        Object.assign(guitarBody, R.pick(reqGuitarBody, bodySpawnPointKeys));
        // if the body data exists in the request, update it
        for(let textureKey of bodyTexturesKey){
          const reqBodyTexture = (reqGuitarBody[textureKey] as GuitarBodyTextureDto);
          if(!!reqBodyTexture){
            // if the texture data exists in the request, update it
            const loadedReqBodyTextureMedia = await findEachEntity(DI.repository.medias, {
              backMask : reqBodyTexture.backMask,
              backShadowTexture : reqBodyTexture.backShadowTexture,
              backSpecularTexture : reqBodyTexture.backSpecularTexture,
              frontHoleMask : reqBodyTexture.frontHoleMask,
              mask : reqBodyTexture.mask,
              frontShadowTexture : reqBodyTexture.frontShadowTexture,
              frontSpecularTexture : reqBodyTexture.frontSpecularTexture,
            })

            if(!!(guitarBody as GuitarBody)[textureKey]){
              // if the texture exists in the body, update it
              if(!!reqBodyTexture){
                // if the texture data exists in the request, update it
                Object.assign((guitarBody[textureKey]) as GuitarBodyTexture, { scale : reqBodyTexture.scale,...loadedReqBodyTextureMedia});
              }else{
                // if the texture data doesn't exist in the request, do nothing
              }
            }else{
              // if the texture doesn't exist in the body, create it
              const {scale,...reqBodyTexture} = (reqGuitarBody[textureKey] as GuitarBodyTextureDto);
              if(!!reqBodyTexture){
                // if the texture data exists in the request, create it
                const newTexture = new GuitarBodyTexture({ ...loadedReqBodyTextureMedia ,scale, body: (guitarBody as GuitarBody)});
                // @ts-ignore
                guitarBody[textureKey] = newTexture;
                DI.em.persist(newTexture);
              }else{
                // if the texture data doesn't exist in the request, do nothing
              }
            }
          } else {
            // if the texture data doesn't exist in the request, do nothing
          }
        }
      }else{
        // if the body data doesn't exist in the request, do nothing
      }
    }else{
      // if the body doesn't exist in the model, create it
      await createBody(reqData, model, bodyKey);
    }
  }

  await DI.em.flush();

  return res.send("ok");
}))
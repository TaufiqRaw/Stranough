import { Router } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { DI } from "../app";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { MediaService, MediaService as Service } from "../services/media.service";
import { validateDto } from "../utils/validate-dto.util";
import { ImageUploadDto } from "../dtos/image-upload.dto";
import { BadRequestError } from "../utils/classes/error.class.util";
import * as Enums from "../enums";
import * as Constants from "../constants";
import asyncMiddleware from "middleware-async";
import { multerUpload, multerUploadPrefImage } from "../middlewares";
export const router = Router();

router.get("/", async (req, res) => {
  const pagination = getPagination(req);
  const result = await findAndPaginateEntity(DI.repository.medias, pagination);
  return res.json(
    result
  );
});

router.post(`/thumbnails`,multerUpload , asyncMiddleware(Service.createGuitarTextureHandler({
  maxWidth : 200,
  maxHeight : 200
})));

router.post(`/user-preference`, multerUploadPrefImage, asyncMiddleware(Service.createUserPreferenceHandler({
  maxWidth : 500,
  name : async (req) => {
    if (!req.body.name) {
      throw new BadRequestError("name is required");
    }
    return `preference-${req.body.name}`;
  }
})));

router.get('/orphaned', asyncMiddleware(async (req, res) => {
  return res.json(await MediaService.findOrphanedMedia());
}));

router.delete('/orphaned', asyncMiddleware(async (req, res) => {
  const orphanedMedias = (await MediaService.findOrphanedMedia())[0];
  orphanedMedias.forEach(m=>{
    DI.em.remove(m);
  });
  await DI.em.flush();
  return res.json('ok');
}));

// Create a route for each guitar part
Object.values(Enums.GuitarPart).forEach(part => {
  router.post(`/${part}`,multerUpload , asyncMiddleware(Service.createGuitarTextureHandler(Constants.maxImageResolution[part])));
});
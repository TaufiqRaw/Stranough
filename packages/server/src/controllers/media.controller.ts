import { Router } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { DI } from "../app";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { MediaService as Service } from "../services/media.service";
import { validateDto } from "../utils/validate-dto.util";
import { ImageUploadDto } from "../dtos/image-upload.dto";
import { BadRequestError } from "../utils/classes/error.class.util";
import * as Enums from "../enums";
import * as Constants from "../constants";
import asyncMiddleware from "middleware-async";
import { multerUpload } from "../middlewares";
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

// Create a route for each guitar part
Object.values(Enums.GuitarPart).forEach(part => {
  router.post(`/${part}`,multerUpload , asyncMiddleware(Service.createGuitarTextureHandler(Constants.maxImageResolution[part])));
});
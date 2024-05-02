import { Router } from "express";
import { DI } from "../app";
import { validatePagination } from "../middlewares/validate-pagination.middleware";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { getPagination } from "../utils/get-pagination.util";
import { validateDto } from "../utils/validate-dto.util";
import { GuitarBodyTextureDto } from "../dtos/guitar-body-texture.dto";
import { GuitarBodyTexture } from "../entities/guitar-body-texture.entity";
import { findOneEntity } from "../utils/find-one-entity.util";
import { BadRequestError } from "../utils/classes/error.class.util";
import { findEachEntity } from "../utils/find-one-multiple-entity";
import { Media } from "../entities/media.entity";

const bodyTextureRepo = DI.repository.guitarBodyTextures;
const bodyRepo = DI.repository.guitarBodies;
const imageRepo = DI.repository.medias;

const router = Router();

router.get("/", validatePagination, async (req, res) => {
  const textures = await findAndPaginateEntity(bodyTextureRepo, getPagination(req));
  return res.json(textures);
});

router.post("/", async (req, res) => {
  const {body : _body, backMask, backShadowTexture, backSpecularTexture, frontHoleMask, frontMask, frontShadowTexture, frontSpecularTexture, ...data} = await validateDto(req, GuitarBodyTextureDto);
  
  const body = await findOneEntity(bodyRepo, _body);

  if(!body) throw new BadRequestError("Body not found");
  const textures = findEachEntity(imageRepo, {
    backMask,
    backShadowTexture,
    backSpecularTexture,
    frontHoleMask,
    frontMask,
    frontShadowTexture,
    frontSpecularTexture
  });

  const newTexture = new GuitarBodyTexture({body, ...textures,...data});
  await DI.em.persistAndFlush(newTexture);
  return res.json(newTexture);
});



export default router;



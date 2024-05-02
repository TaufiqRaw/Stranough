import { Router } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { DI } from "../app";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { MediaService as Service } from "../services/media.service";
import { MAX_IMAGE_RESOLUTION as imgRes } from "../constants";
import { validateDto } from "../utils/validate-dto.util";
import { ImageUploadDto } from "../dtos/image-upload.dto";
import { BadRequestError } from "../utils/classes/error.class.util";
import { GuitarPartEnum  } from "../enums";
const mediaRepo = DI.repository.medias;

const router = Router();

router.get("/", async (req, res) => {
  const pagination = getPagination(req);
  const result = await findAndPaginateEntity(mediaRepo, pagination);
  return res.json(
    result
  );
});

router.use(DI.upload.single('file'));

// Create a route for each guitar part
Object.values(GuitarPartEnum).forEach(part => {
  router.post(`/${part}`, Service.createGuitarTextureHandler(imgRes[part]));
});

export default router;
import { Router } from "express";
import { DI } from "../app";
import { validatePagination } from "../middlewares/validate-pagination.middleware";
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { findOneEntity } from "../utils/find-one-entity.util";
import { validateDto } from "../utils/validate-dto.util";
import { GuitarBodyCreateDto} from "../dtos/guitar-body-create.dto";
import { BadRequestError } from "../utils/classes/error.class.util";
import { GuitarBody } from "../entities/guitar-body.entity";
import { GuitarBodyUpdateDto } from "../dtos/guitar-body-update.dto";

const bodyRepo = DI.repository.guitarBodies;
const bodyTextureRepo = DI.repository.guitarBodyTextures;

const router = Router();

router.get("/", validatePagination, async (req, res) => {
  const pagination = getPagination(req);
  const result = await findAndPaginateEntity(bodyRepo, pagination);
  return res.json(result);
});

router.post("/", async (req, res) => {
  const data = await validateDto(req, GuitarBodyCreateDto);

  const newBody = new GuitarBody(data);
  await DI.em.persistAndFlush(newBody);

  return res.json(newBody);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await validateDto(req, GuitarBodyUpdateDto);

  const body = await findOneEntity(bodyRepo, id);
  if (body == undefined) throw new BadRequestError("Body not found");

  Object.assign(body, data);

  await DI.em.flush();

  return res.json(body);
});


export default router;
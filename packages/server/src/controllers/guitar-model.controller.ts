import { Router } from "express";
import { validatePagination } from "../middlewares/validate-pagination.middleware";
import { getPagination } from "../utils/get-pagination.util";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { DI } from "../app";
import { validateDto } from "../utils/validate-dto.util";
import { GuitarModel } from "../entities/guitar-model.entity";
import { findOneEntity } from "../utils/find-one-entity.util";
import { BadRequestError } from "../utils/classes/error.class.util";
import { GuitarBody } from "../entities/guitar-body.entity";
import { GuitarBodyTexture } from "../entities/guitar-body-texture.entity";
import { GuitarModelUpdateDto } from "../dtos/guitar-model-update.dto";
const modelRepo = DI.repository.guitarModels;

const router = Router();

router.get('/', validatePagination, async(req,res)=>{
  const pagination = getPagination(req);
  const result = await findAndPaginateEntity(modelRepo, pagination);
  return res.json(
    result
  )
})

router.post('/', async(req,res)=>{
  const nextId = await modelRepo.count() + 1;

  const newModel = new GuitarModel({
    name : `Guitar Model #${nextId}`,
    description : `Description for Guitar Model #${nextId}`,
  });
  const newBoltOnBody = new GuitarBody({
    model : newModel,
  });
  const newFlatTopBackTexture = new GuitarBodyTexture({
    body : newBoltOnBody,
  })
  newBoltOnBody.flatTopBackTexture = newFlatTopBackTexture;

  await DI.em.persistAndFlush(newFlatTopBackTexture);

  return res.json(newModel);
})

router.put('/:id', async(req,res)=>{
  const data = await validateDto(req, GuitarModelUpdateDto);

  const id = parseInt(req.params.id);
  const model = await findOneEntity(modelRepo, id);
  if (model == undefined) throw new BadRequestError("Model not found");

  Object.assign(model, data);

  await DI.em.flush();

  return res.json(model);
})

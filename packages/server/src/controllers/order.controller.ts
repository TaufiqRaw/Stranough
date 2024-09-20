import { Router } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { DI } from "../app";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { validateDto } from "../utils/validate-dto.util";
import { ImageUploadDto } from "../dtos/image-upload.dto";
import { BadRequestError, ForbiddenError } from "../utils/classes/error.class.util";
import * as Enums from "../enums";
import * as Constants from "../constants";
import asyncMiddleware from "middleware-async";
import { multerUpload } from "../middlewares";
import { OrderDto } from "../dtos/order.dto";
import { Order, User } from "../entities";
import { findOneEntity } from "../utils/find-one-entity.util";
import { authService } from "../services/auth.service";
import { unlink } from "fs/promises";
export const router = Router();

router.get("/", authService.jwtAuth(), asyncMiddleware(async (req, res) => {
  const pagination = getPagination(req);

  const finishedOnly = req.query.finishedOnly === 'true';
  const finishedOnlyFilter = finishedOnly ? { isFinished : true } : {}; 

  const user = req.user;
  let userFilter = {} as {
    createdBy ?: User
  };
  if(user){
    const findUser = await findOneEntity(DI.repository.users, user.id);
    if(!findUser){
      throw new BadRequestError("User not found");
    }
    if(!findUser.isAdmin){
      userFilter = {
        createdBy : findUser
      }
    }
  }

  const result = await findAndPaginateEntity(DI.repository.orders, pagination, {
    ...finishedOnlyFilter,
    ...userFilter
  },{
    populate : ['createdBy'] as never,
  });
  return res.json(
    result
  );
}));

router.get("/:id", asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    throw new BadRequestError("Invalid id");
  const order = await findOneEntity(DI.repository.orders, id, {
    orderBy : { 'createdAt' : 'DESC' }
  });
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  return res.json(order);
}));


router.post("/", authService.jwtAuth() ,asyncMiddleware(async (req, res) => {
  const {user} = req;
  if(!user)
    throw new BadRequestError("User not found");

  const findUser = await findOneEntity(DI.repository.users, user.id);
  if(!findUser){
    throw new BadRequestError("User not found");
  }

  const { isFinished,...dto} = await validateDto(req, OrderDto);
  const newOrder = new Order({...dto, 
    isFinished: isFinished ?? false,
    createdBy : findUser
  });
  await DI.em.persistAndFlush(newOrder);
  return res.json(newOrder.id);
}));

router.put("/:id", authService.jwtAuth(), asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);
  const {user} = req;
  if(!user)
    throw new BadRequestError("User not found");
  if (isNaN(id))
    throw new BadRequestError("Invalid id");
  const order = await findOneEntity(DI.repository.orders, id);
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  if(order.createdBy.id !== user.id && !user.isAdmin){
    throw new ForbiddenError();
  }
  
  const { isFinished,...dto} = await validateDto(req, OrderDto);
  order.isFinished = isFinished ?? order.isFinished;
  Object.assign(order, dto);
  await DI.em.flush();
  return res.json(order.id);
}));

router.delete("/:id", authService.jwtAuth(), asyncMiddleware(async (req, res) => {
  const id = parseInt(req.params.id);
  const {user} = req;
  if(!user)
    throw new BadRequestError("User not found");
  if (isNaN(id))
    throw new BadRequestError("Invalid id");
  const order = await findOneEntity(DI.repository.orders, id);
  if (!order) {
    throw new BadRequestError("Order not found");
  }
  if(order.createdBy.id !== user.id && !user.isAdmin){
    throw new ForbiddenError();
  }
  if(order.preferencesImgLength && order.oldId){
    for(let i = 0; i < order.preferencesImgLength; i++){
      try{
        await unlink(`${Constants.imagePath}/preference-${order.oldId}-${i}.png`);
      }catch(e){
        DI.logger.error(`OrderController.delete : unable to delete image ${e}`);
      }
    }
  }
  DI.em.remove(order);
  await DI.em.flush();
  return res.json('ok');
}));

export default router;
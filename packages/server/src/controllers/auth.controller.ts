import { Router } from "express";
import { getPagination } from "../utils/get-pagination.util";
import { DI } from "../app";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { validateDto } from "../utils/validate-dto.util";
import { BadRequestError } from "../utils/classes/error.class.util";
import asyncMiddleware from "middleware-async";
import { OrderDto } from "../dtos/order.dto";
import { Order } from "../entities";
import { findOneEntity } from "../utils/find-one-entity.util";
import {compare} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as Constants from '../constants'
import { authService } from "../services/auth.service";

export const router = Router();

require('dotenv').config({
  path : Constants.envPath
});

router.post("/login", authService.login);
router.post("/register", authService.register);
router.post("/refresh", authService.refresh);

export default router;
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Pickup } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { Expose, Transform } from "class-transformer";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import {Pickup as PickupConfig} from 'stranough-common'

@ExposeAll()
export class PickupDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Pickup>> {
  @IsEnum(PickupConfig.PickupType)
  @Transform(({value})=>(""+value).toLowerCase())
  @IsString()
  @OptionalOnUpdate()
  type: `${PickupConfig.PickupType}`;

  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;
}
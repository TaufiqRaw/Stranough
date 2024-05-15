import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Pickup } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./base-entity-with-sprite.dto";
import { GuitarPickupType } from "../enums";
import { Transform } from "class-transformer";

export class PickupDto extends BaseEntityWithSpriteDto implements EntityWithoutSprite<Pickup> {
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsString()
  @Transform(({value})=>value.toLowerCase())
  @IsEnum(GuitarPickupType)
  type: GuitarPickupType;
}
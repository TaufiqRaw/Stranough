import { Expose, Type } from "class-transformer";
import { BaseEntityWithSpriteDto } from "./base-entity-with-sprite.dto";
import { Bridge } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, Length, Validate, ValidateNested } from "class-validator";
import { PositionDto } from "./position.dto";

export class BridgeDto extends BaseEntityWithSpriteDto implements EntityWithoutSprite<Bridge> {
  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  stringCount: number;

  //TODO: add validation for stringSpawnPoint so it length must be equal to stringCount
  @Expose()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  stringSpawnPoint: PositionDto[];
}
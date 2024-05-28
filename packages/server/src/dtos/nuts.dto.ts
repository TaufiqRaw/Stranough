import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Nut } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./base-entity-with-sprite.dto";
import { Expose, Type } from "class-transformer";
import { PositionDto } from "./position.dto";

export class NutDto extends BaseEntityWithSpriteDto implements Partial<EntityWithoutSprite<Nut>> {
  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  stringCount?: number;

  //TODO: add validation for stringSpawnPoint so it length must be equal to stringCount
  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  stringSpawnPoint?: PositionDto[];
}
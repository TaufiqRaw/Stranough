import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Nut } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { Expose, Type } from "class-transformer";
import { PositionDto } from "./position.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";

@ExposeAll()
export class NutDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Nut>> {
  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;

  //TODO: add validation for stringSpawnPoint so it length must be equal to stringCount
  @OptionalOnUpdate()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  stringSpawnPoint?: PositionDto[];
}
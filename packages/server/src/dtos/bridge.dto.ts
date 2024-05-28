import { Expose, Type } from "class-transformer";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { Bridge } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, Length, Validate, ValidateNested } from "class-validator";
import { PositionDto } from "./position.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class BridgeDto extends BaseEntityWithSpriteDto implements Partial<EntityWithoutSprite<Bridge>> {
  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;

  //TODO: add validation for stringSpawnPoint so it length must be equal to stringCount
  @OptionalOnUpdate()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  stringSpawnPoint ?: PositionDto[][];
}
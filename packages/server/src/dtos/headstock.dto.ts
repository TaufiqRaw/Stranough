import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { Headstock } from "../entities";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { PositionWithRotation } from "../interfaces/position.interface";
import { KeyOf } from "../interfaces/class-key.interface";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class HeadstockDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Headstock>> {
  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;

  @OptionalOnUpdate()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionWithRotationDto)
  pegsSpawnPoint?: PositionWithRotationDto[];

  @IsOptional()
  @IsNumber()
  backShadowTexture?: number | null;

  @IsOptional()
  @IsNumber()
  frontShadowTexture?: number | null;
}
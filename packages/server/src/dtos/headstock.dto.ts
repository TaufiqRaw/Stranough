import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { Headstock } from "../entities";
import { PosRotWithFlippedDto, PositionDto, PositionWithRotationDto } from "./position.dto";
import { PositionWithRotation } from "../interfaces/position.interface";
import { KeyOf } from "../interfaces/class-key.interface";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class HeadstockDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Headstock>> {
  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;

  @OptionalOnUpdate()
  @IsBoolean()
  isSlotted?: boolean;

  @OptionalOnUpdate()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosRotWithFlippedDto)
  pegsSpawnPoint?: PosRotWithFlippedDto[];

  @IsOptional()
  @IsNumber()
  backShadowTexture?: number | null;

  @IsOptional()
  @IsNumber()
  frontShadowTexture?: number | null;

  @IsOptional()
  @IsNumber()
  slottedRodOffset?: number;

  @IsOptional()
  @IsNumber()
  slottedGuardLength?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionWithRotationDto)
  slottedGuardSpawnPoint?: PositionWithRotationDto[];
}
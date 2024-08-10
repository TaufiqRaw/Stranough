import { Expose, Type } from "class-transformer";
import { Peg } from "../entities";
import { KeyOf } from "../interfaces/class-key.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithThumbnail } from "./common-entity.dto";
import { PositionDto } from "./position.dto";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class PegDto extends BaseEntityWithThumbnail implements KeyOf<EntityWithoutBase<Peg>>{
  @OptionalOnUpdate()
  @ValidateNested()
  @Type(() => PositionDto)
  pegBackPivotPosition ?: PositionDto;

  @IsOptional()
  @IsNumber()
  slottedStringCount?: number | null;

  @IsOptional()
  @IsString()
  slottedGuardColor?: string | null;

  @OptionalOnUpdate()
  @ValidateNested()
  @Type(() => PositionDto)
  pivotPosition?: PositionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PositionDto)
  pegRodPivotPosition?: PositionDto;

  @OptionalOnUpdate()
  @IsNumber()
  pegBackTexture?: number;

  @OptionalOnUpdate()
  @IsNumber()
  pegCapTexture?: number;

  @IsOptional()
  @IsNumber()
  pegRodTexture?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scale?: number;

  @OptionalOnUpdate()
  @IsBoolean()
  isBass?: boolean;

  @OptionalOnUpdate()
  @IsBoolean()
  forSlottedHeadstock?: boolean;
}
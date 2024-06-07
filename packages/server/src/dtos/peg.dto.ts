import { Expose, Type } from "class-transformer";
import { Peg } from "../entities";
import { KeyOf } from "../interfaces/class-key.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithThumbnail } from "./common-entity.dto";
import { PositionDto } from "./position.dto";
import { IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class PegDto extends BaseEntityWithThumbnail implements KeyOf<EntityWithoutBase<Peg>>{
  @OptionalOnUpdate()
  @ValidateNested()
  @Type(() => PositionDto)
  pegBackPivotPosition ?: PositionDto;

  @OptionalOnUpdate()
  @ValidateNested()
  @Type(() => PositionDto)
  pivotPosition?: PositionDto;

  @OptionalOnUpdate()
  @IsNumber()
  pegBackTexture?: number;

  @OptionalOnUpdate()
  @IsNumber()
  pegCapTexture?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scale?: number;
}
import { Omit } from "utility-types";
import { BaseEntity, BaseEntityWithSprite, Media } from "../entities";
import { Position } from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateBy, ValidateIf, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { PositionDto } from "./position.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class BaseEntityWithDescDto {

  @OptionalOnUpdate()
  @IsString()
  name?: string;

  @OptionalOnUpdate()
  @IsString()
  description?: string;

  @OptionalOnUpdate()
  @IsNumber()
  price?: number;
}

@ExposeAll()
export class BaseEntityWithThumbnail extends BaseEntityWithDescDto {
  @IsOptional()
  @IsNumber()
  thumbnail?: number;
}

@ExposeAll()
export class BaseEntityWithSpriteDto extends BaseEntityWithThumbnail implements Partial<EntityWithoutBase<Omit<BaseEntityWithSprite, 'thumbnail' | 'texture'>>>{

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  pivotPosition?: Position;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scale?: number;

  @OptionalOnUpdate()
  @IsNumber()
  texture?: number;
}
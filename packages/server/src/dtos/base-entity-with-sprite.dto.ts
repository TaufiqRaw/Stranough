import { Omit } from "utility-types";
import { BaseEntityWithSprite, Media } from "../entities";
import { Position } from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateBy, ValidateIf, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { PositionDto } from "./position.dto";

export class BaseEntityWithSpriteDto implements Partial<EntityWithoutBase<Omit<BaseEntityWithSprite, 'thumbnail' | 'texture'>>>{
  @Expose()
  @IsNotEmpty({
    groups : ['update']
  })
  @IsOptional({
    groups : ['create']
  })
  @IsNumber()
  id?: number;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsString()
  name?: string;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsString()
  description?: string;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  pivotPosition?: Position;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  price?: number;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  scale?: number;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  texture?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  thumbnail?: number;
}
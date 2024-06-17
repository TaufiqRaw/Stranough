import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, Min, ValidateNested } from "class-validator";
import { GuitarBodyContourDto } from "./guitar-body-contour.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { GuitarBody } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { KeyOf } from "../interfaces/class-key.interface";

@ExposeAll()
export class GuitarBodyDto implements KeyOf<EntityWithoutBase<GuitarBody>>{

  @IsOptional()
  @IsNumber()
  mask ?: number | null;

  @IsOptional()
  @IsNumber()
  backMask ?: number | null;

  @OptionalOnUpdate()
  @IsNumber()
  @Min(0)
  price ?: number;

  @IsOptional()
  @IsNumber()
  burstTop?: number | null;

  @IsOptional()
  @IsNumber()
  burstBack?: number | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  topForearmContour ?: GuitarBodyContourDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  topCarvedContour ?: GuitarBodyContourDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  topFlatContour ?: GuitarBodyContourDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  backTummyContour ?: GuitarBodyContourDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  backCarvedContour ?: GuitarBodyContourDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyContourDto)
  backFlatContour ?: GuitarBodyContourDto | null;
}
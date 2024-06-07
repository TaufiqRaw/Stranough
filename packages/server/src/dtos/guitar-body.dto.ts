import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, Min, ValidateNested } from "class-validator";
import { GuitarBodyTextureDto } from "./guitar-body-texture.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { GuitarBody } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { KeyOf } from "../interfaces/class-key.interface";

@ExposeAll()
export class GuitarBodyDto implements KeyOf<EntityWithoutBase<GuitarBody>>{

  @IsOptional()
  @IsNumber()
  mask ?: number | null;

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
  @IsNumber()
  maskScale ?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmCutTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  flatTopBackTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  tummyCutTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmTummyCutTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopBackTexture?: GuitarBodyTextureDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTummyCutTexture?: GuitarBodyTextureDto | null;
}
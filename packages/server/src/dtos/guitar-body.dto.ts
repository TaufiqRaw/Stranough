import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";
import { GuitarBodyTextureDto } from "./guitar-body-texture.dto";

export class GuitarBodyDto {

  @Expose()
  @IsOptional()
  @IsNumber()
  mask ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  maskScale ?: number;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  flatTopBackTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  tummyCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmTummyCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopBackTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTummyCutTexture?: GuitarBodyTextureDto | null;
}
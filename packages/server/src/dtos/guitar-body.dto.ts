import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";
import { GuitarBodyTextureDto } from "./guitar-body-texture.dto";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class GuitarBodyDto {

  @IsOptional()
  @IsNumber()
  mask ?: number;

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
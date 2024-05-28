import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class GuitarBodyTextureDto { 
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  scale ?: number;

  @IsOptional()
  @IsNumber()
  frontHoleMask ?: number;

  @IsOptional()
  @IsNumber()
  mask ?: number;

  @IsOptional()
  @IsNumber()
  backMask ?: number;

  @IsOptional()
  @IsNumber()
  frontShadowTexture ?: number;

  @IsOptional()
  @IsNumber()
  backShadowTexture ?: number;

  @IsOptional()
  @IsNumber()
  frontSpecularTexture ?: number;

  @IsOptional()
  @IsNumber()
  backSpecularTexture ?: number;
}
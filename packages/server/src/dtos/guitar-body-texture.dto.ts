import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class GuitarBodyTextureDto { 
  
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  scale ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  frontHoleMask ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  mask ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  backMask ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  frontShadowTexture ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  backShadowTexture ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  frontSpecularTexture ?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  backSpecularTexture ?: number;
}
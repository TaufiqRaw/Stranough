import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class GuitarBodyTextureDto { 
  @IsOptional()
  @IsNumber()
  body : number;
  
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  scale : number;

  @IsOptional()
  @IsNumber()
  frontHoleMask ?: number;

  @IsOptional()
  @IsNumber()
  frontMask ?: number;

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
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { GuitarBodyTexture } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class GuitarBodyTextureDto implements KeyOf<EntityWithoutBase<GuitarBodyTexture>>{ 
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  scale ?: number;

  @OptionalOnUpdate()
  @IsNumber()
  @Min(0)
  price ?: number;

  @IsOptional()
  @IsNumber()
  frontHoleMask ?: number | null;

  @IsOptional()
  @IsNumber()
  mask ?: number | null;

  @IsOptional()
  @IsNumber()
  backMask ?: number | null;

  @IsOptional()
  @IsNumber()
  frontShadowTexture ?: number | null;

  @IsOptional()
  @IsNumber()
  backShadowTexture ?: number | null;

  @IsOptional()
  @IsNumber()
  frontSpecularTexture ?: number | null;

  @IsOptional()
  @IsNumber()
  backSpecularTexture ?: number | null;

  @IsOptional()
  @IsNumber()
  burstBack ?: number | null;

  @IsOptional()
  @IsNumber()
  burstTop?: number | null;
}
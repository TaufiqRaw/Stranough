import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { GuitarBodyContour } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class GuitarBodyContourDto implements KeyOf<EntityWithoutBase<GuitarBodyContour>>{ 

  @OptionalOnUpdate()
  @IsNumber()
  @Min(0)
  price ?: number;

  @IsOptional()
  @IsNumber()
  specularTexture?: number | null;

  @IsOptional()
  @IsNumber()
  shadowTexture?: number | null;
}
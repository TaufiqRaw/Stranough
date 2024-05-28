import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class PositionDto {
  @IsNotEmpty()
  @IsNumber()
  x : number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  y : number;
}

@Expose()
export class PositionWithRotationDto extends PositionDto {
  @OptionalOnUpdate()
  @IsNumber()
  rotation : number;
}
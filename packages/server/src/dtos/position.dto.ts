import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class PositionDto {
  @IsNotEmpty()
  @IsNumber()
  x : number;

  @IsNotEmpty()
  @IsNumber()
  y : number;
}

@ExposeAll()
export class PositionWithRotationDto extends PositionDto {
  @IsNotEmpty()
  @IsNumber()
  rotation : number;
}

@ExposeAll()
export class PosRotWithFlippedDto extends PositionWithRotationDto  {
  @IsNotEmpty()
  @IsBoolean()
  flipped : boolean;
}
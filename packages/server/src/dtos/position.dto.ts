import { IsNotEmpty, IsNumber } from "class-validator";

export class PositionDto {
  @IsNotEmpty()
  @IsNumber()
  x : number;

  @IsNotEmpty()
  @IsNumber()
  y : number;
}

export class PositionWithRotationDto extends PositionDto {
  @IsNotEmpty()
  @IsNumber()
  rotation : number;
}
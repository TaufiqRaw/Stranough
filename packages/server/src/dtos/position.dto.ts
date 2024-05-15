import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class PositionDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  x : number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  y : number;
}

export class PositionWithRotationDto extends PositionDto {
  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsNumber()
  rotation : number;
}
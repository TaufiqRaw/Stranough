import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";

export class GuitarModelUpdateDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  neckThroughBody ?: number;

  @IsOptional()
  @IsNumber()
  setInBody ?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each : true, message : 'pickguards must be an array of numbers'})
  pickguards ?: number[];
}

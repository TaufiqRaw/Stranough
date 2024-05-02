import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";

export class GuitarModelCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}

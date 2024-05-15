import { Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { GuitarBodyDto } from "./guitar-body.dto";

export class GuitarModelDto {
  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty({
    groups : ['create']
  })
  @IsOptional({
    groups : ['update']
  })
  @IsString()
  description: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  thumbnail ?: number;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  boltOnBody?: GuitarBodyDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  neckThroughBody ?: GuitarBodyDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  setInBody ?: GuitarBodyDto;
}

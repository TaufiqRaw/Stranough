import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from "class-validator";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { GuitarModel } from "../entities/guitar-model.entity";

export class GuitarBodyUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  model: GuitarModel;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  fingerboardSpawnPoint: PositionDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridgeSpawnPoint: PositionDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PositionDto)
  pickupSpawnPoint?: PositionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PositionDto)
  knobSpawnPoint?: PositionDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  switchSpawnPoint?: PositionWithRotationDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  topJackSpawnPoint?: PositionWithRotationDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  sideJackSpawnPoint?: PositionWithRotationDto;

  @IsOptional()
  @IsNumber()
  forearmCutTexture?: number;

  @IsOptional()
  @IsNumber()
  tummyCutTexture?: number;

  @IsOptional()
  @IsNumber()
  forearmTummyCutTexture?: number;

  @IsOptional()
  @IsNumber()
  carvedTopTexture?: number;

  @IsOptional()
  @IsNumber()
  carvedTopBackTexture?: number;

  @IsOptional()
  @IsNumber()
  carvedTopTummyCutTexture?: number;
}
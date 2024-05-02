import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from "class-validator";
import { GuitarModel } from "../entities/guitar-model.entity";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { Type } from "class-transformer";

export class GuitarBodyCreateDto {
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
}

import { Expose, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { GuitarBodyDto } from "./guitar-body.dto";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { PickupSpawnPointDto } from "./pickup-spawn-point.dto";

export class GuitarModelDto {
  @Expose()
  @IsNotEmpty({
    groups: ["create"],
  })
  @IsOptional({
    groups: ["update"],
  })
  @IsString()
  name?: string;

  @Expose()
  @IsNotEmpty({
    groups: ["create"],
  })
  @IsOptional({
    groups: ["update"],
  })
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  thumbnail?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  allowSingleCoilPickup?: boolean;

  @Expose()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  fingerboardSpawnPoint: PositionDto;

  @Expose()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridgeSpawnPoint: PositionDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PickupSpawnPointDto)
  pickupSpawnPoint?: PickupSpawnPointDto;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PositionDto)
  knobSpawnPoint?: PositionDto[];

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  switchSpawnPoint?: PositionWithRotationDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  topJackSpawnPoint?: PositionWithRotationDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  sideJackSpawnPoint?: PositionWithRotationDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  boltOnBody?: GuitarBodyDto | null;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  neckThroughBody?: GuitarBodyDto | null;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  setInBody?: GuitarBodyDto | null;
}

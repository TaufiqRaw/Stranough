import { Expose, Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { PickupSpawnPointDto } from "./pickup-spawn-point.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { ElectricGuitarModel } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class ElectricGuitarModelDto implements KeyOf<EntityWithoutBase<ElectricGuitarModel>> {
  @OptionalOnUpdate()
  @IsString()
  name?: string;

  @OptionalOnUpdate()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  thumbnail?: number;

  @OptionalOnUpdate()
  @IsNumber()
  @Min(0)
  price ?: number;

  @IsOptional()
  @IsNumber()
  maskScale ?: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  fingerboardSpawnPoint: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  fingerboardBackEndSpawnPoint?: PositionDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridgeSpawnPoint: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PickupSpawnPointDto)
  pickupSpawnPoint?: PickupSpawnPointDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PositionDto)
  knobSpawnPoint?: PositionDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  switchSpawnPoint?: PositionWithRotationDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  topJackSpawnPoint?: PositionWithRotationDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  sideJackSpawnPoint?: PositionWithRotationDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  pickguardSpawnPoint?: PositionDto;

  // ---------------------------------- CONSTRUCTION ----------------------------------

  @IsOptional()
  @IsNumber()
  boltOnConstructionMask?: number;

  @IsOptional()
  @IsNumber()
  setInConstructionMask?: number;

  @IsOptional()
  @IsNumber()
  neckThroughConstructionMask?: number;

  // ---------------------------------- CONTOUR ----------------------------------

  @IsOptional()
  @IsNumber()
  flatContourShadow?: number;

  @IsOptional()
  @IsNumber()
  flatContourSpec?: number;

  @IsOptional()
  @IsNumber()
  forearmContourShadow?: number;

  @IsOptional()
  @IsNumber()
  forearmContourSpec?: number;

  @IsOptional()
  @IsNumber()
  carvedContourShadow?: number;

  @IsOptional()
  @IsNumber()
  carvedContourSpec?: number;

  @IsOptional()
  @IsNumber()
  tummyContourShadow?: number;

  @IsOptional()
  @IsNumber()
  tummyContourSpec?: number;

}

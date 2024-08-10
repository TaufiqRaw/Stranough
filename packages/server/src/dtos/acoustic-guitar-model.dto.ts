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
import { AcousticGuitarModel } from "../entities/_acoustic-guitar-model.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class AcousticGuitarModelDto implements KeyOf<EntityWithoutBase<AcousticGuitarModel>> {
  @OptionalOnUpdate()
  @IsString()
  name?: string;

  @IsOptional()
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

  // ----------------- SPAWN POINTS -----------------

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  topSpawnPoint?: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bottomSpawnPoint?: PositionDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridgeSpawnPoint: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  preampSpawnPoint?: PositionWithRotationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionWithRotationDto)
  strapPinSpawnPoints ?: PositionWithRotationDto[];

  // ----------------- MASK -----------------
  @OptionalOnUpdate()
  @IsNumber()
  normalMask?: number;

  @OptionalOnUpdate()
  @IsNumber()
  beveledMask?: number;

  // ----------------- CUTAWAY -----------------

  @IsOptional()
  @IsNumber()
  florentineCutawayMask?: number | null;

  @IsOptional()
  @IsNumber()
  softCutawayMask?: number | null;

  @IsOptional()
  @IsNumber()
  venetianCutawayMask?: number | null;
}

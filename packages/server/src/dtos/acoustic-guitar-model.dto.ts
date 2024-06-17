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
import { GuitarBodyDto } from "./guitar-body.dto";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { PickupSpawnPointDto } from "./pickup-spawn-point.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { AcousticGuitarModel } from "../entities/acoustic-guitar-model.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class AcousticGuitarModelDto implements KeyOf<EntityWithoutBase<AcousticGuitarModel>> {
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
  @Type(() => PositionWithRotationDto)
  jackSpawnPoint?: PositionWithRotationDto;

  @IsOptional()
  @IsNumber()
  florentineCutawayBurst?: number | null;

  @IsOptional()
  @IsNumber()
  florentineCutawayMask?: number | null;

  @IsOptional()
  @IsNumber()
  noneCutawayBurst?: number | null;

  @IsOptional()
  @IsNumber()
  noneCutawayMask?: number | null;

  @IsOptional()
  @IsNumber()
  softCutawayBurst?: number | null;

  @IsOptional()
  @IsNumber()
  softCutawayMask?: number | null;

  @IsOptional()
  @IsNumber()
  venetianCutawayBurst?: number | null;

  @IsOptional()
  @IsNumber()
  venetianCutawayMask?: number | null;
}

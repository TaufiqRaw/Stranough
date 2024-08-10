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
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { KeyOf } from "../interfaces/class-key.interface";
import { ElectricGuitarModel } from "../entities";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

@ExposeAll()
export class ElectricGuitarModelDto implements KeyOf<EntityWithoutBase<ElectricGuitarModel>> {
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

  @OptionalOnUpdate()
  @IsNumber()
  mask?: number;

  @IsOptional()
  @IsBoolean()
  isBass?: boolean;

  @IsOptional()
  @IsBoolean()
  flipElectronicCover?: boolean;

  @IsOptional()
  @IsNumber()
  maskScale ?: number;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  topSpawnPoint?: PositionDto;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bottomSpawnPoint?: PositionDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionWithRotationDto)
  strapPinSpawnPoints ?: PositionWithRotationDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  soundHoleSpawnPointLeft?: PositionWithRotationDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  soundHoleSpawnPointRight?: PositionWithRotationDto | null;

  @IsOptional()
  @IsNumber()
  soundHoleScale?: number;

  @IsOptional()
  @IsBoolean()
  mirrorSoundHole?: boolean;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  electronicCoverSpawnPoint?: PositionWithRotationDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  minorElectronicCoverSpawnPoint?: PositionWithRotationDto | null;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  batteryCoverSpawnPoint?: PositionWithRotationDto | null;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  logoSpawnPoint?: PositionWithRotationDto | null;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridgeSpawnPoint?: PositionDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => PositionDto)
  knobSpawnPoint?: PositionDto[] | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  switchSpawnPoint?: PositionWithRotationDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  topJackSpawnPoint?: PositionWithRotationDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  sideJackSpawnPoint?: PositionWithRotationDto | null;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  bottomHeadlessSpawnPoint?: PositionDto;

  // ---------------------------------- CONTOUR ----------------------------------

  @IsOptional()
  @IsNumber()
  flatContourOverlay?: number | null;

  @IsOptional()
  @IsNumber()
  forearmContourOverlay?: number | null;

  @IsOptional()
  @IsNumber()
  carvedContourOverlay?: number | null;

  @IsOptional()
  @IsNumber()
  tummyContourOverlay?: number | null;

}

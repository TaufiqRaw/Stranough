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
import { GuitarModel } from "../entities";

@ExposeAll()
export class GuitarModelDto implements KeyOf<GuitarModel> {
  @OptionalOnUpdate()
  @IsString()
  name?: string;

  @OptionalOnUpdate()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  thumbnail?: number;

  @IsOptional()
  @IsBoolean()
  allowSingleCoilPickup?: boolean;

  @OptionalOnUpdate()
  @IsBoolean()
  isElectric?: boolean;

  @OptionalOnUpdate()
  @IsNumber()
  @Min(0)
  price ?: number;

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

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  boltOnBody?: GuitarBodyDto | null;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  neckThroughBody?: GuitarBodyDto | null;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => GuitarBodyDto)
  setInBody?: GuitarBodyDto | null;
}

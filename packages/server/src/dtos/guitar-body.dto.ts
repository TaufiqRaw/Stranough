import { Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { PickupSpawnPointDto } from "./pickup-spawn-point.dto";
import { GuitarBodyTextureDto } from "./guitar-body-texture.dto";

export class GuitarBodyDto {

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
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  flatTopBackTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  tummyCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  forearmTummyCutTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopBackTexture?: GuitarBodyTextureDto | null;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GuitarBodyTextureDto)
  carvedTopTummyCutTexture?: GuitarBodyTextureDto | null;
}
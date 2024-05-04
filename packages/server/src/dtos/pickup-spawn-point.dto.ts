import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { PositionDto } from "./position.dto";
import { Type } from "class-transformer";

export class PickupSpawnPointDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridge: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  middle: PositionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  neck: PositionDto;
}
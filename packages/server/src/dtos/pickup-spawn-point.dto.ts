import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { PositionDto } from "./position.dto";
import { Expose, Type } from "class-transformer";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class PickupSpawnPointDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bridge?: PositionDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  middle?: PositionDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  neck?: PositionDto;
}
import { Expose, Transform, Type } from "class-transformer";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { Bridge } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Length, Validate, ValidateNested } from "class-validator";
import { PositionDto, PositionWithRotationDto } from "./position.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { Position, PositionWithRotation } from "../interfaces/position.interface";
import { Pickup as PickupConfig, Bridge as BridgeConfig } from "stranough-common";
import { KeyOf } from "../interfaces/class-key.interface";

@ExposeAll()
export class BridgeDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Bridge>> {
  @OptionalOnUpdate()
  @IsNumber()
  stringCount?: number;

  @OptionalOnUpdate()
  @IsBoolean()
  isBass?: boolean;

  @OptionalOnUpdate()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  bottomPoint?: Position | undefined;

  @OptionalOnUpdate()
  @IsBoolean()
  tremolo?: boolean | undefined;

  @IsOptional()
  @IsEnum(PickupConfig.PickupType)
  @IsString()
  supportedPickup ?: `${PickupConfig.PickupType}` | null;

  @OptionalOnUpdate()
  @IsEnum(BridgeConfig.BridgeType)
  @IsString()
  type?: `${BridgeConfig.BridgeType}`;

  @OptionalOnUpdate()
  @IsBoolean()
  extendable?: boolean | undefined;

  @IsOptional()
  @IsBoolean()
  multiscale : boolean;

  @IsOptional()
  @IsBoolean()
  headless : boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionWithRotationDto)
  pickupSpawnPoint?: PositionWithRotationDto | null;

  //TODO: add validation for stringSpawnPoint so it length must be equal to stringCount
  @OptionalOnUpdate()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  stringSpawnPoint?: PositionDto[];
}
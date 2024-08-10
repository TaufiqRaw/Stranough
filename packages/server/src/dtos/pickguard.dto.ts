import { Expose, Transform, Type } from "class-transformer";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { Pickguard } from "../entities";
import { KeyOf } from "../interfaces/class-key.interface";
import { BaseEntityWithDescDto } from "./common-entity.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";
import { IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { PositionDto } from "./position.dto";
import { PickguardConfig } from "stranough-common";

@ExposeAll()
export class PickguardDto extends BaseEntityWithDescDto implements KeyOf<EntityWithoutBase<Pickguard>>{
  @OptionalOnUpdate()
  @IsNumber()
  model?: number;

  @OptionalOnUpdate()
  @IsNumber()
  texture?: number;

  @OptionalOnUpdate()
  @ValidateNested()
  @Type(() => PositionDto)
  pivotPosition?: PositionDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scale?: number;

  @IsEnum(PickguardConfig.PickguardType)
  @Transform(({value})=>(""+value).toLowerCase())
  @IsString()
  @OptionalOnUpdate()
  type: `${PickguardConfig.PickguardType}`;
}
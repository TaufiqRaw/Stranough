import { IsNumber } from "class-validator";
import { Wood } from "../entities";
import { KeyOf } from "../interfaces/class-key.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithDescDto } from "./common-entity.dto";
import { ExposeAll, OptionalOnUpdate } from "./util.decorator";

@ExposeAll()
export class WoodDto extends BaseEntityWithDescDto implements KeyOf<EntityWithoutBase<Wood>> {
  @OptionalOnUpdate()
  @IsNumber()
  texture?: number;
}
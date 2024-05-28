import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { Jack } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";
import { Expose } from "class-transformer";
import { KeyOf } from "../interfaces/class-key.interface";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class JackDto extends BaseEntityWithSpriteDto implements KeyOf<EntityWithoutSprite<Jack>> {
  @IsOptional()
  @IsBoolean()
  isSide ?: boolean;
}
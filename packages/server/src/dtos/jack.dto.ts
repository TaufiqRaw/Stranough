import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { Jack } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./base-entity-with-sprite.dto";
import { Expose } from "class-transformer";

export class JackDto extends BaseEntityWithSpriteDto implements Partial<EntityWithoutSprite<Jack>> {
  @Expose()
  @IsOptional({
    groups : ['update']
  })
  @IsBoolean()
  isSide ?: boolean;
}
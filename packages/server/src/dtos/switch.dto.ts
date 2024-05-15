import { Switch } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./base-entity-with-sprite.dto";

export class SwitchDto extends BaseEntityWithSpriteDto implements EntityWithoutSprite<Switch> {}
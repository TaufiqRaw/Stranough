import { Switch } from "../entities";
import { EntityWithoutSprite } from "../interfaces/entity-without-base.interface";
import { BaseEntityWithSpriteDto } from "./common-entity.dto";

export class SwitchDto extends BaseEntityWithSpriteDto implements EntityWithoutSprite<Switch> {}
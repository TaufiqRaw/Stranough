import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type SwitchProps = EntityWithoutBase<Switch>;

@Entity()
export class Switch extends BaseEntityWithSprite {

  constructor(props : SwitchProps){
    super();
    classAssign(this, props);
  }
}
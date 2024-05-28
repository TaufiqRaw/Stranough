import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type SwitchProps = EntityWithSprite<Switch>;

@Entity()
export class Switch extends BaseEntityWithSprite {

  constructor(props : SwitchProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}
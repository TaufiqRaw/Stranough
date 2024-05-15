import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type KnobProps = EntityWithoutBase<Knob>;

@Entity()
export class Knob extends BaseEntityWithSprite {

  constructor(props : KnobProps){
    super();
    classAssign(this, props);
  }
}
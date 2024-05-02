import { Cascade, ChangeSet, ChangeSetType, Check, Collection, Entity, FlushEventArgs, OneToMany, OneToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Headstock } from "./headstock.entity";

export type GuitarModelProps = Omit<
  EntityWithoutBase<GuitarModel>, 'pickguards' | 'headstocks'
>;

@Entity()
export class GuitarModel extends BaseEntity {
  @Property()
  name : string;

  @Property()
  description : string;
  
  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true})
  boltOnBody ?: GuitarBody;

  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true})
  neckThroughBody ?: GuitarBody;

  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true})
  setInBody ?: GuitarBody;

  @OneToMany(()=>Pickguard, (p)=>p.model)
  pickguards = new Collection<Pickguard>(this);

  @OneToMany(()=>Headstock, h=>h.model)
  headstocks = new Collection<Headstock>(this);

  constructor(props : GuitarModelProps){
    super();
    classAssign(this, props);
  }
}
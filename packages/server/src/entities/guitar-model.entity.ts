import { Cascade, ChangeSet, ChangeSetType, Check, Collection, Entity, FlushEventArgs, ManyToOne, OneToMany, OneToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Headstock } from "./headstock.entity";
import { Media } from "./media.entity";
import { maxDescriptionLength } from "../constants";

export type GuitarModelProps = Omit<
  EntityWithoutBase<GuitarModel>, 'pickguards' | 'headstocks'
>;

@Entity()
export class GuitarModel extends BaseEntity {
  @Property()
  @Unique()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  thumbnail ?: Media;
  
  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true, orphanRemoval : true, cascade : [Cascade.ALL]})
  boltOnBody ?: GuitarBody;

  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true, orphanRemoval : true, cascade : [Cascade.ALL]})
  neckThroughBody ?: GuitarBody;

  @OneToOne(()=>GuitarBody, m=>m.model, {owner : true, orphanRemoval : true, cascade : [Cascade.ALL]})
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
import { ManyToOne, Property, Unique} from "@mikro-orm/core";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { Position } from "../interfaces/position.interface";
import { BaseEntity } from "./base.entity";
import { maxDescriptionLength } from "../constants";

export abstract class BaseEntityWithSprite extends BaseEntity {
  @Property()
  @Unique()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  thumbnail ?: Media;

  @Property()
  price : number;

  @Property(idProperty)
  texture : Media;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;
}
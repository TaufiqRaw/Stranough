import { Entity, Index, PrimaryKey, Property } from "@mikro-orm/core";
import { idProperty } from '../utils/id-property.util';
import { VectorType } from "../interfaces/vector-type";

export type IntentsProps = {[x in keyof Omit<Intents, 'id'>] : Intents[x]};

@Entity()
@Index({ name: 'intents_hnsw_l2_idx', expression: 'CREATE INDEX "intents_hnsw_l2_idx" ON "intents" USING hnsw (utterance vector_l2_ops)' })
export class Intents{
  @PrimaryKey({autoincrement : true, ...idProperty})
  id!: number;

  @Property({length : 100})
  intent : string;
  
  @Property({type : VectorType, length : 1536})
  utterance : number[];

  constructor(props : IntentsProps){
    Object.assign(this, props);
  }
}
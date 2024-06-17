import { BeforeCreate, BeforeUpdate, EventArgs, HiddenProps, OnInit, OnLoad, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { maxDescriptionLength } from "../constants";
import { VectorType } from "../interfaces/vector-type";
import { IntentClassifierService } from "../services/intent.classifier.service";

export abstract class BaseEntityWithDesc extends BaseEntity {

  @Property()
  @Unique()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  lastDescription : string | undefined;

  @Property({hidden : true, type : VectorType, length : 1536})
  embedding ?: number[];

  @OnLoad()
  onLoad() {
    this.lastDescription = this.description;
  }

  // @BeforeUpdate()
  // async beforeUpdate(args: EventArgs<BaseEntityWithDesc>) {
  //   const etty = args.entity;
  //   if(etty.description && (etty.description !== this.lastDescription)){
  //     this.embedding = await IntentClassifierService.createEmbedding(etty.description);
  //   }
  // }

  // @BeforeCreate()
  // async beforeCreate(args: EventArgs<BaseEntityWithDesc>) {
  //   const etty = args.entity;
  //   if(etty.description){
  //     this.embedding = await IntentClassifierService.createEmbedding(etty.description);
  //   }
  // }
}
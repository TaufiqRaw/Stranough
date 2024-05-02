import { BeforeDelete, Entity, Enum, EventArgs, Index, Property, Unique } from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { rm } from "fs/promises";
import { join } from "path";
import { DI } from "../app";
import { IMAGE_PATH } from "../constants";
import { BaseEntity } from "./base.entity";
import { GuitarPartEnum } from "../enums";

export type MediaProps = EntityWithoutBase<Media>;

@Entity()
export class Media extends BaseEntity {
  @Property()
  @Unique()
  name : string;

  @Property()
  filename : string;

  @Property()
  mimeType : string;

  constructor(props : MediaProps){
    super();
    classAssign(this, props);
  }

  @BeforeDelete()
  async beforeDelete(args: EventArgs<Media>) {
    const media = args.entity;
    try {
      await rm(join(IMAGE_PATH, media.filename));
    } catch (err) {
      throw Error('[Media.entity@destroyImage] file deletion error');
    }
  }
}
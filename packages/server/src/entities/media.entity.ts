import { BeforeDelete, Entity, Enum, EventArgs, Index, Property, Unique } from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { rm } from "fs/promises";
import { join } from "path";
import { DI } from "../app";
import { BaseEntity } from "./base.entity";
import * as Constants from "../constants";

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

  @Property()
  height : number;

  @Property()
  width : number;

  constructor(props : MediaProps){
    super();
    classAssign(this, props);
  }

  @BeforeDelete()
  async beforeDelete(args: EventArgs<Media>) {
    const media = args.entity;
    try {
      await rm(join(Constants.imagePath, media.filename));
    } catch (err) {
      //@ts-ignore
      const code = err?.code || '';
      if(code !== 'ENOENT')
        throw Error(`[Media.entity@destroyImage] file deletion error, ${err}`);
    }
  }
}
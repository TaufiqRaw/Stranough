import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  Property,
  ref,
} from "@mikro-orm/core";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Media } from "./media.entity";
import { GuitarModelBodyPivot } from "./guitar-model-body.pivot.entity";
import {
  Position,
  PositionWithRotation,
} from "../interfaces/position.interface";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { Mutable } from "utility-types";

export type GuitarModelProps = Omit<
  EntityWithoutBase<GuitarModel>,
  "pickguards" | "headstocks" | (typeof GuitarModel.bodyKeys)[number] | 'modelBodyPivot'
>;

/* invariants : 
    bodyPivot : 
      always has 3 items, one for each body type
      on creation, all 3 items are added
      but the bodies are not set (body is null)
    loadBodies :  will not load the body if it is already loaded or already set (by the setter)
*/
@Entity()
@Index({ name: 'guitar_model_hnsw_l2_idx', expression: 'CREATE INDEX "guitar_model_hnsw_l2_idx" ON "guitar_model" USING hnsw (embedding vector_l2_ops)' })
export class GuitarModel extends BaseEntityWithDesc {
  static bodyKeys = Object.freeze([
    "boltOnBody",
    "neckThroughBody",
    "setInBody",
  ] as const);

  static mediaKeys = Object.freeze([
    "thumbnail",
  ] as const);

  static spawnPointKeys = Object.freeze([
    "knobSpawnPoint",
    "bridgeSpawnPoint",
    "pickupSpawnPoint",
    "switchSpawnPoint",
    "topJackSpawnPoint",
    "sideJackSpawnPoint",
    "fingerboardSpawnPoint",
  ] as const);

  @ManyToOne(() => Media, { deleteRule: "set null", updateRule: "cascade" })
  thumbnail?: Media;

  @OneToMany(() => GuitarModelBodyPivot, (p) => p.model, {
    cascade: [Cascade.ALL],
  })
  modelBodyPivot = new Collection<GuitarModelBodyPivot>(this);

  @Property({ type: "json" })
  fingerboardSpawnPoint?: Position;

  @Property({ type: "json" })
  bridgeSpawnPoint?: Position;

  @Property()
  allowSingleCoilPickup?: boolean = true;

  @Property()
  price : number;

  @Property({ type: "json" })
  pickupSpawnPoint?: {
    bridge?: Position;
    middle?: Position;
    neck?: Position;
  };

  @Property()
  isElectric?: boolean = true;

  @Property({ type: "json" })
  knobSpawnPoint?: Position[];

  @Property({ type: "json" })
  switchSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  topJackSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  sideJackSpawnPoint?: PositionWithRotation;

  @OneToMany(() => Pickguard, (p) => p.model)
  pickguards = new Collection<Pickguard>(this);

  private _boltOnBody?: GuitarBody;
  private _neckThroughBody?: GuitarBody;
  private _setInBody?: GuitarBody;

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get boltOnBody() {
    return this._boltOnBody;
  }
  @Property({ type: "any", serializer: (v) => v, persist: false })
  get neckThroughBody() {
    return this._neckThroughBody;
  }
  @Property({ type: "any", serializer: (v) => v, persist: false })
  get setInBody() {
    return this._setInBody;
  }

  constructor(props: GuitarModelProps) {
    super();
    classAssign(this, props);
    for (const pivot of GuitarModel.bodyKeys) {
      this.modelBodyPivot.add(
        new GuitarModelBodyPivot({
          model: this,
          type: pivot,
        })
      );
    }
  }

  private async loadBody(type: typeof GuitarModel.bodyKeys[number]) {
    if(this[type] !== undefined){
      return;
    }
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot
      .getItems()
      .find((p) => p.type === type);
    if (b?.body) {
      this[`_${type}`] = await b.body.load() ?? undefined;
    }
    return b;
  }

  async setBoltOnBody(body: GuitarBody) {
    await this.setBody(body, "boltOnBody");
  }
  async setNeckThroughBody(body: GuitarBody) {
    await this.setBody(body, "neckThroughBody");
  }
  async setSetInBody(body: GuitarBody) {
    await this.setBody(body, "setInBody");
  }
  private async setBody(body: GuitarBody, type: typeof GuitarModel.bodyKeys[number]) {
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot
      .getItems()
      .find((p) => p.type === type);
    if (b) {
      b.body = ref(body);
      this[`_${type}`] = body;
    }
  }

  async loadBodies() {
    for(const type of GuitarModel.bodyKeys){
      await this.loadBody(type);
    }
  }

  async deepLoadBodies() {
    await this.loadBodies();
    for(const type of GuitarModel.bodyKeys){
      await this[type]?.loadTextures();
    }

    for(const bodyKey of GuitarModel.bodyKeys){
      const body = this[bodyKey];
      for(const textureKey of GuitarBody.textureKeys){
        await body?.[textureKey]?.loadMedias();
      }
    }
  }
}

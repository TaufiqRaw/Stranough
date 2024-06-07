import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  Ref,
  Unique,
  ref,
} from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarModel } from "./guitar-model.entity";
import { GuitarBodyTexture } from "./guitar-body-texture.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarModelBodyPivot } from "./guitar-model-body.pivot.entity";
import { GuitarBodyTexturePivot } from "./guitar-body-texture.pivot.entity";
import * as Constants from "../constants";
import { Media } from "./media.entity";

export type GuitarBodyProps = Omit<
  EntityWithoutBase<GuitarBody>,
  | "modelBodyPivot"
  | "bodyTexturePivot"
  | (typeof GuitarBody.mediaKeys)[number]
  | (typeof GuitarBody.textureKeys)[number]
  | "maskScale"
> & { mask?: Media };

@Entity()
export class GuitarBody extends BaseEntity {
  static mediaKeys = Object.freeze([
    "mask",
    "burstTop",
    "burstBack"
  ] as const);

  static textureKeys = Object.freeze([
    "carvedTopTexture",
    "tummyCutTexture",
    "forearmCutTexture",
    "flatTopBackTexture",
    "carvedTopBackTexture",
    "forearmTummyCutTexture",
    "carvedTopTummyCutTexture",
  ] as const);

  @OneToMany(() => GuitarModelBodyPivot, (p) => p.body, {
    cascade: [Cascade.ALL],
  })
  modelBodyPivot: GuitarModel;

  @OneToMany(() => GuitarBodyTexturePivot, (p) => p.body, {
    cascade: [Cascade.ALL],
  })
  bodyTexturePivot = new Collection<GuitarBodyTexturePivot>(this);

  @ManyToOne(() => Media, Constants.mediaFKOption)
  mask?: Ref<Media>;

  @Property({ type: "float" })
  maskScale?: number = 1;

  @ManyToOne(() => Media, Constants.mediaFKOption)
  burstTop?: Ref<Media>;

  @ManyToOne(() => Media, Constants.mediaFKOption)
  burstBack?: Ref<Media>;

  @Property({nullable : false, default : 0})
  price ?: number = 0;

  private _carvedTopTexture?: GuitarBodyTexture;
  private _tummyCutTexture?: GuitarBodyTexture;
  private _forearmCutTexture?: GuitarBodyTexture;
  private _flatTopBackTexture?: GuitarBodyTexture;
  private _carvedTopBackTexture?: GuitarBodyTexture;
  private _forearmTummyCutTexture?: GuitarBodyTexture;
  private _carvedTopTummyCutTexture?: GuitarBodyTexture;

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get carvedTopTexture() {
    return this._carvedTopTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get tummyCutTexture() {
    return this._tummyCutTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get forearmCutTexture() {
    return this._forearmCutTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get flatTopBackTexture() {
    return this._flatTopBackTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get carvedTopBackTexture() {
    return this._carvedTopBackTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get forearmTummyCutTexture() {
    return this._forearmTummyCutTexture;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get carvedTopTummyCutTexture() {
    return this._carvedTopTummyCutTexture;
  }

  constructor(_props: GuitarBodyProps) {
    super();
    const { mask, ...props } = _props;
    classAssign(this, props);
    if (mask) this.mask = ref(mask);
    for (const pivot of GuitarBody.textureKeys) {
      this.bodyTexturePivot.add(
        new GuitarBodyTexturePivot({
          body: this,
          type: pivot,
        })
      );
    }
  }

  private async loadTexture(type: typeof GuitarBody.textureKeys[number]) {
    if (this[type] !== undefined) {
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot
      .getItems()
      .find((p) => p.type === type);
    if (t?.texture) {
      this[`_${type}`] = await t.texture.load({
        populate: GuitarBodyTexture.mediaKeys,
      }) ?? undefined;
    }
    return t;
  }

  async setCarvedTopTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "carvedTopTexture");
  }

  async setTummyCutTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "tummyCutTexture");
  }

  async setForearmCutTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "forearmCutTexture");
  }

  async setFlatTopBackTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "flatTopBackTexture");
  }

  async setCarvedTopBackTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "carvedTopBackTexture");
  }

  async setForearmTummyCutTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "forearmTummyCutTexture");
  }

  async setCarvedTopTummyCutTexture(texture: GuitarBodyTexture) {
    await this.setTexture(texture, "carvedTopTummyCutTexture");
  }
  private async setTexture(
    texture: GuitarBodyTexture,
    type: typeof GuitarBody.textureKeys[number]
  ) {
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot
      .getItems()
      .find((p) => p.type === type);
    if (t) {
      t.texture = ref(texture);
      this[`_${type}`] = texture;
    }
  }

  async loadTextures() {
    for(const media of GuitarBody.mediaKeys){
      await this[media]?.load();
    }

    for (const type of GuitarBody.textureKeys) {
      await this.loadTexture(type);
    }
  }
}

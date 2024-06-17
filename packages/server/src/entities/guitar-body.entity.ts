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
import { ElectricGuitarModel } from "./electric-guitar-model.entity";
import { GuitarBodyContour } from "./guitar-body-contour.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { ElectricModelBodyPivot } from "./electric-model-body.pivot.entity";
import { GuitarBodyContourPivot } from "./guitar-body-contour.pivot.entity";
import * as Constants from "../constants";
import { Media } from "./media.entity";
import {GuitarBody as cGuitarBody} from 'stranough-common'

export type GuitarBodyProps = Omit<
  EntityWithoutBase<GuitarBody>,
  | "modelBodyPivot"
  | "bodyTexturePivot"
  | (typeof GuitarBody.mediaKeys)[number]
  | (typeof cGuitarBody.contourKeys)[number]
  | "maskScale"
> & { mask?: Media };

@Entity()
export class GuitarBody extends BaseEntity {
  static mediaKeys = Object.freeze([
    "mask",
    "backMask",
    "burstTop",
    "burstBack",
  ] as const);

  @OneToMany(() => ElectricModelBodyPivot, (p) => p.body, {
    cascade: [Cascade.ALL],
  })
  modelBodyPivot: ElectricGuitarModel;

  @OneToMany(() => GuitarBodyContourPivot, (p) => p.body, {
    cascade: [Cascade.ALL],
  })
  bodyTexturePivot = new Collection<GuitarBodyContourPivot>(this);

  @ManyToOne(() => Media, Constants.mediaFKOption)
  mask?: Ref<Media>;

  @ManyToOne(() => Media, Constants.mediaFKOption)
  backMask?: Ref<Media>;

  @ManyToOne(() => Media, Constants.mediaFKOption)
  burstTop?: Ref<Media>;

  @ManyToOne(() => Media, Constants.mediaFKOption)
  burstBack?: Ref<Media>;

  @Property({nullable : false, default : 0})
  price ?: number = 0;

  private _topFlatContour?: GuitarBodyContour;
  private _topCarvedContour?: GuitarBodyContour;
  private _topForearmContour?: GuitarBodyContour;
  private _backFlatContour?: GuitarBodyContour;
  private _backCarvedContour?: GuitarBodyContour;
  private _backTummyContour?: GuitarBodyContour;

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get topFlatContour() {
    return this._topFlatContour;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get topCarvedContour() {
    return this._topCarvedContour;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get topForearmContour() {
    return this._topForearmContour;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get backFlatContour() {
    return this._backFlatContour;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get backCarvedContour() {
    return this._backCarvedContour;
  }

  @Property({ type: "any", serializer: (v) => v, persist: false })
  get backTummyContour() {
    return this._backTummyContour;
  }

  constructor(_props: GuitarBodyProps) {
    super();
    const { mask, ...props } = _props;
    classAssign(this, props);
    if (mask) this.mask = ref(mask);
    for (const pivot of cGuitarBody.contourKeys) {
      this.bodyTexturePivot.add(
        new GuitarBodyContourPivot({
          body: this,
          type: pivot,
        })
      );
    }
  }

  private async loadTexture(type: typeof cGuitarBody.contourKeys[number]) {
    if (this[type] !== undefined) {
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot
      .getItems()
      .find((p) => p.type === type);
    if (t?.texture) {
      this[`_${type}`] = await t.texture.load({
        populate: GuitarBodyContour.mediaKeys,
      }) ?? undefined;
    }
    return t;
  }

  async setTopFlatContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "topFlatContour");
  }
  
  async setTopCarvedContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "topCarvedContour");
  }

  async setTopForearmContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "topForearmContour");
  }

  async setBackFlatContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "backFlatContour");
  }

  async setBackCarvedContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "backCarvedContour");
  }

  async setBackTummyContour(texture: GuitarBodyContour) {
    await this.setTexture(texture, "backTummyContour");
  }

  private async setTexture(
    texture: GuitarBodyContour,
    type: typeof cGuitarBody.contourKeys[number]
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
      await this[media]?.load?.();
    }

    for (const type of cGuitarBody.contourKeys) {
      await this.loadTexture(type);
    }
  }
}

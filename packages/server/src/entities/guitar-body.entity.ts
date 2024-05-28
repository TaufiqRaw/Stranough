import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, Ref, Unique, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarModel } from "./guitar-model.entity";
import { GuitarBodyTexture } from "./guitar-body-texture.entity";
import {Position, PositionWithRotation} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarModelBodyPivot } from "./guitar-model-body.pivot.entity";
import { GuitarBodyTexturePivot } from "./guitar-body-texture.pivot.entity";
import * as Constants from "../constants";
import * as Enums from "../enums";
import { Media } from "./media.entity";

export type GuitarBodyProps = Omit<EntityWithoutBase<GuitarBody>, 'modelBodyPivot' | 'mask' | 'bodyTexturePivot' | 'carvedTopTexture' | 'tummyCutTexture' | 'forearmCutTexture' | 'flatTopBackTexture' | 'carvedTopBackTexture' | 'forearmTummyCutTexture' | 'carvedTopTummyCutTexture'> & {mask ?: Media}

@Entity()
export class GuitarBody extends BaseEntity {
  @OneToMany(()=>GuitarModelBodyPivot, (p)=>p.body, {cascade : [Cascade.ALL]})
  modelBodyPivot : GuitarModel;

  @OneToMany(()=>GuitarBodyTexturePivot, (p)=>p.body, {cascade : [Cascade.ALL]})
  bodyTexturePivot = new Collection<GuitarBodyTexturePivot>(this);

  @ManyToOne(()=>Media, {...Constants.mediaFKOption, serializer: v=>v})
  mask ?: Ref<Media>;

  @Property({type : 'float'})
  maskScale ?: number = 1;

  private _carvedTopTexture ?: GuitarBodyTexture;
  private _tummyCutTexture ?: GuitarBodyTexture;
  private _forearmCutTexture ?: GuitarBodyTexture;
  private _flatTopBackTexture ?: GuitarBodyTexture;
  private _carvedTopBackTexture ?: GuitarBodyTexture;
  private _forearmTummyCutTexture ?: GuitarBodyTexture;
  private _carvedTopTummyCutTexture ?: GuitarBodyTexture;

  @Property({type : 'any', serializer: v=>v, persist : false})
  get carvedTopTexture (){
    return this._carvedTopTexture;
  };

  @Property({type : 'any', serializer: v=>v, persist : false})
  get tummyCutTexture (){
    return this._tummyCutTexture;
  }

  @Property({type : 'any', serializer: v=>v, persist : false})
  get forearmCutTexture (){
    return this._forearmCutTexture;
  }

  @Property({type : 'any', serializer: v=>v, persist : false})
  get flatTopBackTexture (){
    return this._flatTopBackTexture;
  }

  @Property({type : 'any', serializer: v=>v, persist : false})
  get carvedTopBackTexture (){
    return this._carvedTopBackTexture;
  }

  @Property({type : 'any', serializer: v=>v, persist : false})
  get forearmTummyCutTexture (){
    return this._forearmTummyCutTexture;
  }

  @Property({type : 'any', serializer: v=>v, persist : false})
  get carvedTopTummyCutTexture (){
    return this._carvedTopTummyCutTexture;
  }

  constructor(_props : GuitarBodyProps){
    super();
    const {mask, ...props} = _props;
    classAssign(this, props);
    if(mask)
      this.mask = ref(mask);
    for(const pivot of Constants.bodyTexturesKey){
      this.bodyTexturePivot.add(new GuitarBodyTexturePivot({
        body : this,
        type : pivot
      }));
    }
  }

  private async getCarvedTopTexture(){
    if(this.carvedTopTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTop);
    if(t?.texture){
      // @ts-ignore
      this._carvedTopTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getTummyCutTexture(){
    if(this.tummyCutTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.TummyCut);
    if(t?.texture){
      // @ts-ignore
      this._tummyCutTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getForearmCutTexture(){
    if(this.forearmCutTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.ForearmCut);
    if(t?.texture){
      // @ts-ignore
      this._forearmCutTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getFlatTopBackTexture(){
    if(this.flatTopBackTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.FlatTopBack);
    if(t?.texture){
      // @ts-ignore
      this._flatTopBackTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getCarvedTopBackTexture(){
    if(this.carvedTopBackTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTopBack);
    if(t?.texture){
      // @ts-ignore
      this._carvedTopBackTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getForearmTummyCutTexture(){
    if(this.forearmTummyCutTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.ForearmTummyCut);
    if(t?.texture){
      // @ts-ignore
      this._forearmTummyCutTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  private async getCarvedTopTummyCutTexture(){
    if(this.carvedTopTummyCutTexture !== undefined){
      return;
    }
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTopTummyCut);
    if(t?.texture){
      // @ts-ignore
      this._carvedTopTummyCutTexture = await t.texture.load({
        populate : Constants.textureMediasKey
      });
    }
    return t;
  }

  async setCarvedTopTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTop);
    if(t){
      t.texture = ref(texture);
      this._carvedTopTexture = texture;
    }
  }

  async setTummyCutTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.TummyCut);
    if(t){
      t.texture = ref(texture);
      this._tummyCutTexture = texture;
    }
  }

  async setForearmCutTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.ForearmCut);
    if(t){
      t.texture = ref(texture);
      this._forearmCutTexture = texture;
    }
  }

  async setFlatTopBackTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.FlatTopBack);
    if(t){
      t.texture = ref(texture);
      this._flatTopBackTexture = texture;
    }
  }

  async setCarvedTopBackTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTopBack);
    if(t){
      t.texture = ref(texture);
      this._carvedTopBackTexture = texture;
    }
  }

  async setForearmTummyCutTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.ForearmTummyCut);
    if(t){
      t.texture = ref(texture);
      this._forearmTummyCutTexture = texture;
    }
  }

  async setCarvedTopTummyCutTexture(texture : GuitarBodyTexture){
    await this.bodyTexturePivot.load();
    const t = this.bodyTexturePivot.getItems().find(p=>p.type === Enums.GuitarBodyTextureType.CarvedTopTummyCut);
    if(t){
      t.texture = ref(texture);
      this._carvedTopTummyCutTexture = texture;
    }
  }

  async loadTextures(){
    await this.mask?.load();
    await this.getCarvedTopTexture();
    await this.getTummyCutTexture();
    await this.getForearmCutTexture();
    await this.getFlatTopBackTexture();
    await this.getCarvedTopBackTexture();
    await this.getForearmTummyCutTexture();
    await this.getCarvedTopTummyCutTexture();
  }
}
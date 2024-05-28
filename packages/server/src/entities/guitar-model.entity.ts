import { Cascade, ChangeSet, ChangeSetType, Check, Collection, Entity, FlushEventArgs, ManyToMany, ManyToOne, OneToMany, OneToOne, Property, Unique, ref, wrap } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Headstock } from "./headstock.entity";
import { Media } from "./media.entity";
import { maxDescriptionLength } from "../constants";
import { GuitarModelBodyPivot } from "./guitar-model-body.pivot.entity";
import * as Constants from "../constants";
import * as Enums from "../enums";
import { Position, PositionWithRotation } from "../interfaces/position.interface";

export type GuitarModelProps = Omit<
  EntityWithoutBase<GuitarModel>, 'pickguards' | 'headstocks' | 'modelBodyPivot' | 'boltOnBody' | 'neckThroughBody' | 'setInBody'
>;

/* invariants : 
    bodyPivot : 
      always has 3 items, one for each body type
      on creation, all 3 items are added
    loadBodies :  will not load the body if it is already loaded or already set (by the setter)
*/
@Entity()
export class GuitarModel extends BaseEntity {
  @Property()
  @Unique()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  thumbnail ?: Media;
  
  @OneToMany(()=>GuitarModelBodyPivot, (p)=>p.model, {cascade : [Cascade.ALL]})
  modelBodyPivot = new Collection<GuitarModelBodyPivot>(this);

  @Property({type : 'json'})
  fingerboardSpawnPoint ?: Position;

  @Property({type : 'json'})
  bridgeSpawnPoint ?: Position;

  @Property()
  allowSingleCoilPickup ?: boolean = true;

  @Property({type : 'json'})
  pickupSpawnPoint ?: {
    bridge ?: Position;
    middle ?: Position;
    neck ?: Position;
  };

  @Property({type : 'json'})
  knobSpawnPoint ?: Position[];

  @Property({type : 'json'})
  switchSpawnPoint ?: PositionWithRotation;

  @Property({type : 'json'})
  topJackSpawnPoint ?: PositionWithRotation;

  @Property({type : 'json'})
  sideJackSpawnPoint ?: PositionWithRotation;

  @OneToMany(()=>Pickguard, (p)=>p.model)
  pickguards = new Collection<Pickguard>(this);

  private _boltOnBody ?: GuitarBody;
  private _neckThroughBody ?: GuitarBody;
  private _setInBody ?: GuitarBody;

  @Property({type : 'any', serializer: v=>v, persist : false})
  get boltOnBody(){
    return this._boltOnBody;
  }
  @Property({type : 'any', serializer: v=>v, persist : false})
  get neckThroughBody(){
    return this._neckThroughBody;
  }
  @Property({type : 'any', serializer: v=>v, persist : false})
  get setInBody(){
    return this._setInBody;
  }

  constructor(props : GuitarModelProps){
    super();
    classAssign(this, props);
    for(const pivot of Constants.modelBodiesKey){
      this.modelBodyPivot.add(new GuitarModelBodyPivot({
        model : this,
        type : pivot
      }));
    }
  }

  private async getBoltOnBody(){
    if(this.boltOnBody !== undefined){
      return;
    }
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.BoldOnBody);
    if(b?.body){
      // @ts-ignore
      this._boltOnBody = await b.body.load();
    }
    return b;
  }

  private async getNeckThroughBody(){
    if(this.neckThroughBody !== undefined){
      return;
    }
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.NeckThrough);
    if(b?.body){
      // @ts-ignore
      this._neckThroughBody = await b.body.load();
    }
    return b;
  }

  private async getSetInBody(){
    if(this.setInBody !== undefined){
      return;
    }
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.SetInBody);
    if(b?.body){
      // @ts-ignore
      this._setInBody = await b.body.load();
    }
    return b;
  }

  async setBoltOnBody(body : GuitarBody){
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.BoldOnBody);
    if(b){
      b.body = ref(body);
      this._boltOnBody = body;
    }
  }

  async setNeckThroughBody(body : GuitarBody){
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.NeckThrough);
    if(b){
      b.body = ref(body);
      this._neckThroughBody = body;
    }
  }

  async setSetInBody(body : GuitarBody){
    await this.modelBodyPivot.load();
    const b = this.modelBodyPivot.getItems().find(p=>p.type === Enums.GuitarBodyType.SetInBody);
    if(b){
      b.body = ref(body);
      this._setInBody = body;
    }
  }

  async loadBodies(){
    await this.getBoltOnBody();
    await this.getNeckThroughBody();
    await this.getSetInBody();
  }

  async deepLoadBodies(){
    await this.loadBodies();
    if(this.boltOnBody) await this.boltOnBody.loadTextures();
    if(this.neckThroughBody) await this.neckThroughBody.loadTextures();
    if(this.setInBody) await this.setInBody.loadTextures();

    await Promise.all([this.boltOnBody, this.neckThroughBody, this.setInBody].map(async (b)=>{
      for(const textureKey of Constants.bodyTexturesKey){
        if(b){
          const texture = b[textureKey];
          if(texture){
            await texture.loadMedias();
          }
        }
      }
    }))
  }
}
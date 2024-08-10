import { EntityRepository, FilterQuery, Populate } from "@mikro-orm/postgresql";
import { Class, Optional } from "utility-types";
import * as R from "remeda"; 
import { DI } from "../app";
import * as Dto from "../dtos";
import { entityWithMediaRouterFactory } from "../utils/entity-with-media-router.factory";
import { findOneEntity } from "../utils/find-one-entity.util";
import { AcousticModel, Bridge } from "stranough-common";
import { AcousticGuitarModel, BaseEntity, ElectricGuitarModel, Inlay, Media } from "../entities";

const registeredRepoAndMediaKeys: {
  repository : EntityRepository<any>;
  mediaKeys : (keyof any)[];
}[]=[]

function t<
    T extends {
      id : number;
      name : string;
      createdAt : Date;
      updatedAt : Date;
      loadMedias : () => Promise<void>;
    },
    U extends {[k in keyof Partial<Omit<T, 'createdAt' | 'updatedAt' | 'loadMedias'>>] : any},
  >(a : string, b : EntityRepository<T>, c : Class<U>, d : (keyof T)[], e ?: {
    onCreate ?: (validatedDto : U) => Promise<Optional<T>>;
    onUpdate ?: (validatedDto : U, item : T) => Promise<void>;
    queryMapper ?: (query : any)=>FilterQuery<T>;
    additionalPopulate ?: any[];
    onGetOne ?: (item : T)=>Promise<T>;
  }){
    registeredRepoAndMediaKeys.push({repository : b, mediaKeys : d})
    return [a, entityWithMediaRouterFactory(()=>b, c, d, e)] as const
  }

export function initCommonEntityRoutes(){
  const routes = [
    t('electric-guitars', DI.repository.electricModels, Dto.ElectricGuitarModelDto, Array.from(ElectricGuitarModel.mediaKeys), {
      onGetOne : async (item)=>{
        await item.pickguards?.load({
          populate : ['texture']
        })
        return item;
      }
    }),
    t('acoustic-guitars', DI.repository.acousticModels, Dto.AcousticGuitarModelDto, Array.from(AcousticGuitarModel.mediaKeys)),
    t('bridges', DI.repository.bridges, Dto.BridgeDto, ['texture', 'thumbnail'], {
      queryMapper : q=>{
        let type : Bridge.BridgeType[] | undefined;
        if(q.type === 'tailpiece'){
          type = [Bridge.BridgeType.Tailpiece, Bridge.BridgeType.NearTailpiece];
        }
        if(q.type === 'tuneomatic'){
          type = [Bridge.BridgeType.Tuneomatic];
        }
        return {
          'isBass' : q.isBass,
          'stringCount' : (q.stringCount && !isNaN(parseInt(q.stringCount))) 
            ? parseInt(q.stringCount) !== 12  
              ? {
                  $in : [1, parseInt(q.stringCount)]
                } 
              : parseInt(q.stringCount)
            : undefined,
          'headlessOnly' : q.headlessOnly,
          'multiscale' : q.multiscale,
          ...(type ? {type : {
            $in : type
          }} : {})
        }
    }}),
    t('jacks', DI.repository.jacks, Dto.JackDto, ['texture', 'thumbnail'], {
      queryMapper : q=>({
        'isSide' : q.isSide
      })
    }),
    t('knobs', DI.repository.knobs, Dto.KnobDto, ['texture', 'thumbnail']),
    t('nuts', DI.repository.nuts, Dto.NutDto, ['texture', 'thumbnail'], {
      queryMapper : q=>({
        'stringCount' : q.stringCount,
        'isBass' : q.isBass,
        'headlessOnly' : q.headlessOnly
      })
    }),
    t('inlays', DI.repository.inlays, Dto.InlayDto, Array.from(Inlay.mediaKeys)),
    t('pickups', DI.repository.pickups, Dto.PickupDto, ['texture', 'thumbnail'], {
      queryMapper : q=>({
        'type' : q.type,
        'stringCount' : q.stringCount
      })
    }),
    t('switchs', DI.repository.switchs, Dto.SwitchDto, ['texture', 'thumbnail']),
    t('headstocks', DI.repository.headstocks, Dto.HeadstockDto, ['texture', 'thumbnail', 'backShadowTexture', 'frontShadowTexture'], {
      queryMapper : q=>({
        'stringCount' : q.stringCount,
      })
    }),
    t('pegs', DI.repository.pegs, Dto.PegDto, ['thumbnail', 'pegCapTexture', 'pegBackTexture', 'pegRodTexture'], {
      queryMapper : q=>({
        'isBass' : q.isBass,
        'forSlottedHeadstock' : q.forSlottedHeadstock
      })
    }),
    t('woods', DI.repository.woods, Dto.WoodDto, ['texture']),
    t('pickguards', DI.repository.pickguards, Dto.PickguardDto, ['texture'],{
      onCreate : async (dto)=>{
        const modelId = dto.model;
        const model = await findOneEntity(DI.repository.electricModels, modelId);
        return {model};
      },
      onUpdate : async (dto, item)=>{
        if(dto.model){
          const model = await findOneEntity(DI.repository.electricModels, dto.model);
          if(model){
            item.model = model;
          }
        }
      }
    }),
  ] as const

  return routes;
};
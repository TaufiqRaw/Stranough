import { EntityRepository, FilterQuery } from "@mikro-orm/postgresql";
import { Class, Optional } from "utility-types";
import * as R from "remeda"; 
import { DI } from "../app";
import * as Dto from "../dtos";
import { entityWithMediaRouterFactory } from "../utils/entity-with-media-router.factory";
import { findOneEntity } from "../utils/find-one-entity.util";
import { AcousticModel } from "stranough-common";
import { AcousticGuitarModel, ElectricGuitarModel } from "../entities";

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
  }){return [a, entityWithMediaRouterFactory(()=>b, c, d, e)] as const}

export const commonEntityRoutes = ()=>[
  t('bridges', DI.repository.bridges, Dto.BridgeDto, ['texture', 'thumbnail']),
  t('jacks', DI.repository.jacks, Dto.JackDto, ['texture', 'thumbnail']),
  t('knobs', DI.repository.knobs, Dto.KnobDto, ['texture', 'thumbnail']),
  t('nuts', DI.repository.nuts, Dto.NutDto, ['texture', 'thumbnail']),
  t('pickups', DI.repository.pickups, Dto.PickupDto, ['texture', 'thumbnail'], {
    queryMapper : q=>({
      'type' : q.type
    })
  }),
  t('switchs', DI.repository.switchs, Dto.SwitchDto, ['texture', 'thumbnail']),
  t('headstocks', DI.repository.headstocks, Dto.HeadstockDto, ['texture', 'thumbnail', 'backShadowTexture', 'frontShadowTexture']),
  t('pegs', DI.repository.pegs, Dto.PegDto, ['thumbnail', 'pegCapTexture', 'pegBackTexture']),
  t('woods', DI.repository.woods, Dto.WoodDto, ['texture']),
  t('electric-guitars', DI.repository.electricModels, Dto.ElectricGuitarModelDto, Array.from(ElectricGuitarModel.mediaKeys)),
  t('acoustic-guitars', DI.repository.acousticModels, Dto.AcousticGuitarModelDto, Array.from(AcousticGuitarModel.mediaKeys)),
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
] as const;
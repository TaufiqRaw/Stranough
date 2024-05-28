import { EntityRepository } from "@mikro-orm/postgresql";
import { Class } from "utility-types";
import * as R from "remeda"; 
import { DI } from "../app";
import * as Dto from "../dtos";
import { entityWithMediaRouterFactory } from "../utils/entity-with-media-router.factory";

function t<
    T extends {
      id : number;
      name : string;
      createdAt : Date;
      updatedAt : Date;
      loadMedias : () => Promise<void>;
    },
    U extends {[k in keyof Partial<Omit<T, 'createdAt' | 'updatedAt' | 'loadMedias'>>] : any},
  >(a : string, b : EntityRepository<T>, c : Class<U>, d : (keyof T)[]){return [a, entityWithMediaRouterFactory(()=>b, c, d)] as const}

export const commonEntityRoutes = ()=>[
  t('bridges', DI.repository.bridges, Dto.BridgeDto, ['texture', 'thumbnail']),
  t('jacks', DI.repository.jacks, Dto.JackDto, ['texture', 'thumbnail']),
  t('knobs', DI.repository.knobs, Dto.KnobDto, ['texture', 'thumbnail']),
  t('nuts', DI.repository.nuts, Dto.NutDto, ['texture', 'thumbnail']),
  t('pickups', DI.repository.pickups, Dto.PickupDto, ['texture', 'thumbnail']),
  t('switchs', DI.repository.switchs, Dto.SwitchDto, ['texture', 'thumbnail']),
  t('headstocks', DI.repository.headstocks, Dto.HeadstockDto, ['texture', 'thumbnail']),
  t('pegs', DI.repository.pegs, Dto.PegDto, ['thumbnail', 'pegCapTexture', 'pegBackTexture']),
  t('pickguards', DI.repository.pickguards, Dto.PickguardDto, ['texture'])
] as const;
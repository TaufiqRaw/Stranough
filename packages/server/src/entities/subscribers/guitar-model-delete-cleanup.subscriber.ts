import {
  ChangeSetType,
  EventArgs,
  EventSubscriber,
  FlushEventArgs,
} from "@mikro-orm/core";
import { GuitarModel } from "../guitar-model.entity";
import { bodyTexturesKey, modelBodiesKey, textureMediasKey } from "../../constants";
import { GuitarBody, GuitarBodyTexture, Media } from "..";

export class GuitarModelDeleteCleanup implements EventSubscriber<GuitarModel> {
  getSubscribedEntities() {
    return [GuitarModel];
  }
  async beforeDelete(args: EventArgs<GuitarModel>){
    if(!args.entity) return;
    for(const key of modelBodiesKey){
      const _body = args.entity[key];
      const body = _body ? await args.em.findOne(GuitarBody, _body.id) : undefined;
      console.log(body);
      if(body){
        for(const textureKey of bodyTexturesKey){
          const _texture = body[textureKey];
          const texture = _texture ? await args.em.findOne(GuitarBodyTexture, _texture.id) : undefined;
          console.log(texture);
          if(texture){
            for(const mediaKey of textureMediasKey){
              const _media = texture[mediaKey];
              const media = _media ? await args.em.findOne(Media, _media.id) : undefined;
              console.log(media);
              if(media){
                args.em.getUnitOfWork().computeChangeSet(media, ChangeSetType.DELETE);
              }
            }
          }
        }
      }
    }
  }
}

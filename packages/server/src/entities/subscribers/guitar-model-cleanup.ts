import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { GuitarModel } from "..";

export class GuitarModelCleanup implements EventSubscriber<GuitarModel>{
  getSubscribedEntities(): EntityName<GuitarModel>[] {
    return [GuitarModel];
  }

  // async beforeDelete(evt : EventArgs<GuitarModel>){
  //   console.log('deleting guitar model :', evt.entity);
  // }

}
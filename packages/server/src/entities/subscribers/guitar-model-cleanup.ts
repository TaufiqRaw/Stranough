import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { ElectricGuitarModel } from "..";

export class GuitarModelCleanup implements EventSubscriber<ElectricGuitarModel>{
  getSubscribedEntities(): EntityName<ElectricGuitarModel>[] {
    return [ElectricGuitarModel];
  }

  // async beforeDelete(evt : EventArgs<GuitarModel>){
  //   console.log('deleting guitar model :', evt.entity);
  // }

}
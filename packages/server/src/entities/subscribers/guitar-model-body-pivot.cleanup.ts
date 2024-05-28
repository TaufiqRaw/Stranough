import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { GuitarModelBodyPivot } from "..";

export class GuitarModelBodyPivotCleanup implements EventSubscriber<GuitarModelBodyPivot>{
  getSubscribedEntities(): EntityName<GuitarModelBodyPivot>[] {
    return [GuitarModelBodyPivot];
  }
}
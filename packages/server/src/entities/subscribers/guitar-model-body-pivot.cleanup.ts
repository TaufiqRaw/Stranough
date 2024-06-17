import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { ElectricModelBodyPivot } from "..";

export class GuitarModelBodyPivotCleanup implements EventSubscriber<ElectricModelBodyPivot>{
  getSubscribedEntities(): EntityName<ElectricModelBodyPivot>[] {
    return [ElectricModelBodyPivot];
  }
}
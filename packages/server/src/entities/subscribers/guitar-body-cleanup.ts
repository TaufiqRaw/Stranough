import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { GuitarBody } from "..";

export class GuitarBodyCleanup implements EventSubscriber<GuitarBody>{
  getSubscribedEntities(): EntityName<GuitarBody>[] {
    return [GuitarBody];
  }

}
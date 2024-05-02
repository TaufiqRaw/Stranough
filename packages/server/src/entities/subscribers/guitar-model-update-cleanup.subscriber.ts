import {
  ChangeSetType,
  EventSubscriber,
  FlushEventArgs,
} from "@mikro-orm/core";
import { GuitarModel } from "../guitar-model.entity";

export class GuitarModelUpdateCleanup implements EventSubscriber {
  getSubscribedEntities() {
    return [GuitarModel];
  }
  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const cs = changeSets.find(
      (cs) =>
        cs.type === ChangeSetType.UPDATE && cs.entity instanceof GuitarModel
    );

    if (!cs) return;

    const changedEntity = cs.entity as GuitarModel;
    const _oldEntity = args.uow.getOriginalEntityData(changedEntity);

    if (!_oldEntity) return;

    const oldEntity = await args.em.findOne(GuitarModel, _oldEntity.id);

    const oldBoltOnBody = oldEntity?.boltOnBody;
    if (oldBoltOnBody && changedEntity.boltOnBody !== oldBoltOnBody) {
      args.uow.computeChangeSet(oldBoltOnBody, ChangeSetType.DELETE);
    }

    const oldNeckThroughBody = oldEntity?.neckThroughBody;
    if (
      oldNeckThroughBody &&
      changedEntity.neckThroughBody !== oldNeckThroughBody
    ) {
      args.uow.computeChangeSet(oldNeckThroughBody, ChangeSetType.DELETE);
    }

    const oldSetInBody = oldEntity?.setInBody;
    if (oldSetInBody && changedEntity.setInBody !== oldSetInBody) {
      args.uow.computeChangeSet(oldSetInBody, ChangeSetType.DELETE);
    }
  }
}

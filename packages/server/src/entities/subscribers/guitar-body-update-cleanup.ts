import {
  ChangeSetType,
  EventSubscriber,
  FlushEventArgs,
} from "@mikro-orm/core";
import { GuitarBody } from "../guitar-body.entity";

export class GuitarBodyUpdateCleanup implements EventSubscriber {
  getSubscribedEntities() {
    return [GuitarBody];
  }

  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const cs = changeSets.find(
      (cs) =>
        cs.type === ChangeSetType.UPDATE && cs.entity instanceof GuitarBody
    );

    if (!cs) return;

    const changedEntity = cs.entity as GuitarBody;
    const _oldEntity = args.uow.getOriginalEntityData(changedEntity);

    if (!_oldEntity) return;

    const oldEntity = await args.em.findOne(GuitarBody, _oldEntity.id);

    const oldFlatTopBackTexture = oldEntity?.flatTopBackTexture;
    if (
      oldFlatTopBackTexture &&
      changedEntity.flatTopBackTexture !== oldFlatTopBackTexture
    ) {
      args.uow.computeChangeSet(oldFlatTopBackTexture, ChangeSetType.DELETE);
    }

    const oldTummyCutTexture = oldEntity?.tummyCutTexture;
    if (
      oldTummyCutTexture &&
      changedEntity.tummyCutTexture !== oldTummyCutTexture
    ) {
      args.uow.computeChangeSet(oldTummyCutTexture, ChangeSetType.DELETE);
    }

    const oldCarvedTopTexture = oldEntity?.carvedTopTexture;
    if (
      oldCarvedTopTexture &&
      changedEntity.carvedTopTexture !== oldCarvedTopTexture
    ) {
      args.uow.computeChangeSet(oldCarvedTopTexture, ChangeSetType.DELETE);
    }

    const oldForearmCutTexture = oldEntity?.forearmCutTexture;
    if (
      oldForearmCutTexture &&
      changedEntity.forearmCutTexture !== oldForearmCutTexture
    ) {
      args.uow.computeChangeSet(oldForearmCutTexture, ChangeSetType.DELETE);
    }

    const oldCarvedTopBackTexture = oldEntity?.carvedTopBackTexture;
    if (
      oldCarvedTopBackTexture &&
      changedEntity.carvedTopBackTexture !== oldCarvedTopBackTexture
    ) {
      args.uow.computeChangeSet(oldCarvedTopBackTexture, ChangeSetType.DELETE);
    }

    const oldForearmTummyCutTexture = oldEntity?.forearmTummyCutTexture;
    if (
      oldForearmTummyCutTexture &&
      changedEntity.forearmTummyCutTexture !== oldForearmTummyCutTexture
    ) {
      args.uow.computeChangeSet(
        oldForearmTummyCutTexture,
        ChangeSetType.DELETE
      );
    }

    const oldCarvedTopTummyCutTexture = oldEntity?.carvedTopTummyCutTexture;
    if (
      oldCarvedTopTummyCutTexture &&
      changedEntity.carvedTopTummyCutTexture !== oldCarvedTopTummyCutTexture
    ) {
      args.uow.computeChangeSet(
        oldCarvedTopTummyCutTexture,
        ChangeSetType.DELETE
      );
    }
  }
}

import { EntityIndexFactory } from "~/commons/item-index.factory"
import { bridgeRepository } from "./bridge-editor/bridge.repository"
import { jackRepository } from "./jack-editor/jack.repository"
import { knobRepository } from "./knob-editor/knob.repository"
import { nutRepository } from "./nut-editor/nut.repository"
import { pickupRepository } from "./pickup-editor/pickup.repository"
import { switchRepository } from "./switch-editor/switch.repository"
import { electricModelRepository } from "./electric-model-editor/electric-model.repository"
import { pegRepository } from "./peg-editor.ts/peg.repository"
import { headstockRepository } from "./headstock-editor/headstock.repository"
import { pickguardRepository } from "./pickguard-editor/pickguard.repository"
import { acousticGuitarModelRepository } from "./acoustic-model-editor/acoustic-guitar-model.repository"

export const ElectricModel = EntityIndexFactory({
  entityName : electricModelRepository.queryKey()[0],
})

export const AcousticGuitarModel = EntityIndexFactory({
  entityName : acousticGuitarModelRepository.queryKey()[0]
})

export const Bridge = EntityIndexFactory({
  entityName : bridgeRepository.queryKey()[0],
})

export const Jack = EntityIndexFactory({
  entityName : jackRepository.queryKey()[0],
})

export const Knob = EntityIndexFactory({
  entityName : knobRepository.queryKey()[0],
})

export const Nut = EntityIndexFactory({
  entityName : nutRepository.queryKey()[0],
})

export const Pickup = EntityIndexFactory({
  entityName : pickupRepository.queryKey()[0],
})

export const Switch = EntityIndexFactory({
  entityName : switchRepository.queryKey()[0],
})

export const Peg = EntityIndexFactory({
  entityName : pegRepository.queryKey()[0]
})

export const Headstock = EntityIndexFactory({
  entityName : headstockRepository.queryKey()[0]
})

export const Pickguard = EntityIndexFactory({
  entityName : pickguardRepository.queryKey()[0]
})
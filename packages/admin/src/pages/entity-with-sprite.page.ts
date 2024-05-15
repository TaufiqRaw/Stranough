import { EntityIndexFactory } from "~/commons/item-index.factory"

export const Bridge = EntityIndexFactory({
  serverLink : "bridges",
  appLink : "bridges"
})

export const Jack = EntityIndexFactory({
  serverLink : "jacks",
  appLink : "jacks"
})

export const Knob = EntityIndexFactory({
  serverLink : "knobs",
  appLink : "knobs"
})

export const Nut = EntityIndexFactory({
  serverLink : "nuts",
  appLink : "nuts"
})

export const Pickup = EntityIndexFactory({
  serverLink : "pickups",
  appLink : "pickups"
})

export const Switch = EntityIndexFactory({
  serverLink : "switchs",
  appLink : "switchs"
})
export type GuitarPartEnumType = 'body' | 'bridge' | 'pickguard' | 'headstock' | 'jack' | 'knob' | 'nut' | 'peg' | 'switch' | 'pickup';

export enum GuitarPart {
  Body = "body",
  Bridge = "bridge",
  Pickguard = "pickguard",
  Headstock = "headstock",
  Jack = "jack",
  Knob = "knob",
  Nut = "nut",
  Peg = "peg",
  Switch = "switch",
  Pickup = "pickup",
}

export enum GuitarPickupType {
  Single = 'single',
  Humbucker = 'humbucker',
  P90 = 'p90',
  // Filtertron = 'filtertron',
  // WideRange = 'wide-range'
}
export type GuitarPartEnumType = 'body' | 'bridge' | 'pickguard' | 'headstock' | 'jack' | 'knob' | 'nut' | 'peg' | 'switch' | 'pickup';

export enum GuitarPart {
  BODY = "body",
  BRIDGE = "bridge",
  PICKGUARD = "pickguard",
  HEADSTOCK = "headstock",
  JACK = "jack",
  KNOB = "knob",
  NUT = "nut",
  PEG = "peg",
  SWITCH = "switch",
  PICKUP = "pickup",
}

export enum GuitarPickupType {
  Single = 'single',
  Humbucker = 'humbucker',
  P90 = 'p90',
  // Filtertron = 'filtertron',
  // WideRange = 'wide-range'
}
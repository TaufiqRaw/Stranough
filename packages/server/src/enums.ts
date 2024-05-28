export type GuitarPartEnumType = 'body' | 'bridge' | 'pickguard' | 'headstock' | 'jack' | 'knob' | 'nut' | 'peg' | 'switch' | 'pickup';

export enum GuitarBodyType {
  BoldOnBody = 'boltOnBody', 
  NeckThrough = 'neckThroughBody', 
  SetInBody = 'setInBody',
} 

export enum GuitarBodyTextureType {
  CarvedTop = 'carvedTopTexture',
  TummyCut = 'tummyCutTexture',
  ForearmCut = 'forearmCutTexture',
  FlatTopBack = 'flatTopBackTexture',
  CarvedTopBack = 'carvedTopBackTexture',
  ForearmTummyCut = 'forearmTummyCutTexture',
  CarvedTopTummyCut = 'carvedTopTummyCutTexture',
}

export enum GuitarBodyTextureMediaType {
  Mask = 'mask',
  FrontShadowTexture = 'frontShadowTexture',
  FrontSpecularTexture = 'frontSpecularTexture',
  FrontHoleMask = 'frontHoleMask',
  BackShadowTexture = 'backShadowTexture',
  BackSpecularTexture = 'backSpecularTexture',
  BackMask = 'backMask',
}

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
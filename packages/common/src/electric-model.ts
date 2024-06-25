export const spawnPointKeys = Object.freeze([
  "knobSpawnPoint",
  "bridgeSpawnPoint",
  "pickupSpawnPoint",
  "switchSpawnPoint",
  "topJackSpawnPoint",
  "sideJackSpawnPoint",
  "fingerboardSpawnPoint",
  "fingerboardBackEndSpawnPoint",
  "pickguardSpawnPoint"
] as const);

export const constructionKeys = Object.freeze([
  "boltOnConstruction",
  "setInConstruction",
  "neckThroughConstruction",
] as const);
export const constructionMaskKeys = constructionKeys.map((key) => `${key}Mask` as const);

export const contourKeys = Object.freeze([
  "flatContour",
  "carvedContour",
  "forearmContour",
  "tummyContour",
] as const);

export const contourShadowKeys = contourKeys.map((key) => `${key}Shadow` as const);
export const contourSpecKeys = contourKeys.map((key) => `${key}Spec` as const);
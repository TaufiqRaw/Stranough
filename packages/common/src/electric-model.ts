import * as R from 'remeda';

export const spawnPointKeys = Object.freeze([
  "knobSpawnPoint",
  "bridgeSpawnPoint",
  "pickupSpawnPoint",
  "switchSpawnPoint",
  "topJackSpawnPoint",
  "sideJackSpawnPoint",
  "fingerboardSpawnPoint",
  "fingerboardBackEndSpawnPoint",
  "pickguardSpawnPoint",
  "soundHoleSpawnPointLeft",
  "soundHoleSpawnPointRight",
  "electronicsSpawnPoint",
  "minorElectronicCoverSpawnPoint",
  "batteryCoverSpawnPoint",
  "logoSpawnPoint",,
  "topSpawnPoint",
  "bottomSpawnPoint",
] as const);

export const constructionKeys = Object.freeze([
  "boltOnConstruction",
  "setInConstruction",
  "neckThroughConstruction",
] as const);

export const constructionPrice = Object.freeze({
  boltOnConstruction: 0,
  setInConstruction: 0,
  neckThroughConstruction: 850000,
} as const);

export const constructionLabels = Object.freeze({
  boltOnConstruction: "Bolt On",
  setInConstruction: "Set In",
  neckThroughConstruction: "Neck Through",
} as const);

export const topContourKeys = Object.freeze([
  "flatContour",
  "carvedContour",
  "forearmContour",
] as const);

export const backContourKeys = Object.freeze([
  "flatContour",
  "carvedContour",
  "tummyContour",
] as const);

export const contourKeys = R.pipe(
  topContourKeys,
  R.concat(backContourKeys),
  R.unique()
);

export const backContourPrice = Object.freeze({
  flatContour: 0,
  carvedContour: 200000,
  tummyContour: 75000,
} as const);

export const topContourPrice = Object.freeze({
  flatContour: 0,
  carvedContour: 200000,
  forearmContour: 75000,
} as const);

export const contourOverlayKeys = contourKeys.map((key) => `${key}Overlay` as const);

export const contourLabels = Object.freeze({
  flatContour: "Flat",
  carvedContour: "Carved",
  tummyContour: "Tummy",
  forearmContour: "Forearm",
} as const); 
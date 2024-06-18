export const contourKeys = Object.freeze([
  "topFlatContour",
  "topCarvedContour",
  "topForearmContour",
  "backFlatContour",
  "backCarvedContour",
  "backTummyContour",
] as const);

type getTopContour<T> = T extends `top${infer T}` ? `top${T}` : never;
type getBackContour<T> = T extends `back${infer T}` ? `back${T}` : never;

export type AvailableTopContour = getTopContour<typeof contourKeys[number]>;
export type AvailableBackContour = getBackContour<typeof contourKeys[number]>;

export const topContourKeys = contourKeys.filter((key) => key.startsWith("top")) as AvailableTopContour[];
export const backContourKeys = contourKeys.filter((key) => key.startsWith("back")) as AvailableBackContour[];
export declare const contourKeys: readonly ["topFlatContour", "topCarvedContour", "topForearmContour", "backFlatContour", "backCarvedContour", "backTummyContour"];
type getTopContour<T> = T extends `top${infer T}` ? `top${T}` : never;
type getBackContour<T> = T extends `back${infer T}` ? `back${T}` : never;
export type AvailableTopContour = getTopContour<typeof contourKeys[number]>;
export type AvailableBackContour = getBackContour<typeof contourKeys[number]>;
export declare const topContourKeys: AvailableTopContour[];
export declare const backContourKeys: AvailableBackContour[];
export {};

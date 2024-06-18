import { ServerEntities } from "stranough-server";

export const guitarBodyContourMediaKey = Object.freeze(['shadowTexture', 'specularTexture'] as typeof ServerEntities.GuitarBodyContour.mediaKeys[number][]);

export enum GuitarBodySPEnum {
  fingerboard = 1, fingerboardBackEnd, bridge, switch, jackSide, jackTop, pickupNeck , pickupMiddle, pickupBridge, knobs
}

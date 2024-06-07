import { staticStepFactory } from "./static-step-factory";

export const orientationList = ["right-hand", "left-hand"] as const;

export const OrientationStep = staticStepFactory(orientationList, "Pilih orientasi yang kamu inginkan");
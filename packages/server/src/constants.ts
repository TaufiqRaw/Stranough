import { join } from "path";
import { GuitarPartEnum } from "./enums";

export const IMAGE_PATH = join(__dirname, "..", "public", "img");
export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 2MB

export const ERROR_MESSAGE = {
  404 : "Not Found",
  400 : "Bad Request",
  500 : "Internal Server Error",
}

type ImageResolutionConstant = {
  [key in GuitarPartEnum] : {
    maxWidth?: number;
    maxHeight?: number;
  };
}

export const MAX_IMAGE_RESOLUTION : ImageResolutionConstant = {
  "body" : {
    maxWidth : 1024,
  },
  "bridge" : {
    maxWidth : 512,
  },
  "pickguard" : {
    maxWidth : 1024,
  },
  "headstock" : {
    maxWidth : 512,
  },
  "jack" : {
    maxHeight : 256,
  },
  "knob" : {
    maxHeight : 256,
  },
  "nut" : {
    maxWidth : 512,
  },
  "peg" : {
    maxHeight : 256,
  },
  "switch" : {
    maxHeight : 256,
  },
  "pickup" : {
    maxWidth : 512,
  }
}
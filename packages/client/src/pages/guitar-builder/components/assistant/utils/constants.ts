import { GuitarBuilder } from "stranough-common";
import { assistantStepKeysType } from "../assistant-steps";

export const typeToNextStep : {[k in keyof typeof GuitarBuilder.guitarTypes] : assistantStepKeysType} = Object.freeze({
  'electric-guitar' : 'electric-model-type',
  'acoustic-guitar' : 'next',
  "acoustic-bass" : 'next',
  "electric-bass" : 'next',
})
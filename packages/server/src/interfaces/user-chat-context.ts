import { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { KeyOf } from "./class-key.interface";
import { Satisfies } from "./satisfies.interface";
import {GuitarBuilder} from 'stranough-common'
import { Optional } from "utility-types";

export interface OpenAiComponentRecomendation {
  message : string;
  recommendations : (string | number | boolean)[];
  recommendationNames ?: string[];
}

export interface IUserChatContext{
  // input ?: {
  //   value : string;
  //   embeddings ?: number[];
  // }
  selectedComponentName : {
    guitarType ?: typeof GuitarBuilder.guitarTypes[keyof typeof GuitarBuilder.guitarTypes]['name'],
    orientation ?: typeof GuitarBuilder.orientation[keyof typeof GuitarBuilder.orientation]['name'],
  } & {
    electric : {
      [key in keyof GuitarBuilder.SelectedItem['electric']] ?: string;
    }
    acoustic : {
      [key in keyof GuitarBuilder.SelectedItem['acoustic']] ?: string;
    }
    asMessage : ()=>string;
  };
  selectedComponent : {
    guitarType ?: keyof typeof GuitarBuilder.guitarTypes,
    orientation ?: keyof typeof GuitarBuilder.orientation,
  } & {
    electric : {
      [key in keyof GuitarBuilder.SelectedItem['electric']] ?: GuitarBuilder.SelectedItem['electric'][key];
    }
    acoustic : {
      [key in keyof GuitarBuilder.SelectedItem['acoustic']] ?: GuitarBuilder.SelectedItem['electric'][key];
    }
  };
  preferencesDescription ?: string,
  preferencesImgLength ?: number,
  oldId ?: string;
  isFinished : boolean;
  chats : ChatCompletionMessageParam[],
  userId : string;
}
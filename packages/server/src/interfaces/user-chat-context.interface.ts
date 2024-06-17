import { ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { Bridge, GuitarBody, GuitarBodyContour, ElectricGuitarModel, Headstock, Jack, Knob, Peg } from "../entities";
import { KeyOf } from "./class-key.interface";
import { Satisfies } from "./satisfies.interface";
import {GuitarBuilder} from 'stranough-common'

export interface IUserChatContext{
  // input ?: {
  //   value : string;
  //   embeddings ?: number[];
  // }
  chats : ChatCompletionMessageParam[],
  userId : string;
  currentStep ?: keyof GuitarBuilder.SelectedItem;
  selectedComponent : GuitarBuilder.SelectedItem;
}
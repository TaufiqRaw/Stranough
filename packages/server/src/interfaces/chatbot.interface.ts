import { Satisfies } from "./satisfies.interface";
import TrainData from "../train-data.json";
import { Optional } from "utility-types";
import { GuitarModel } from "../entities";
import { pickupConfigurationList } from "../chat-step/pickup-configuration.step";
import { bodyColorTypeList } from "../chat-step/body-static.step";
import { ChatbotStepsType, chatbotSteps } from "../chat-step/_chatbot.step";

export interface StepResponse{total : number, items : any[], itemAsMessage : string,  message : string}

export type SelectResponse = Optional<StepResponse, 'itemAsMessage' | 'items' | 'total'> & {selectedItem : any, context : {currentStep : ChatbotStepsType}}

export type UserIntent = keyof typeof TrainData.intents;

type MappedIntent = Satisfies<{[key in UserIntent] ?: any},{
  askRecomendation ?: IRecommendationBranch
  askQuestion ?: IQuestionBranch,
}>

export interface IUserChatContext {
  id : string;
  currentStep?: (typeof chatbotSteps)[number]["key"];
  lastStep?: (typeof chatbotSteps)[number]["key"];
  selected:{
    isElectric ?: boolean;
    modelId ?: number;
    constructionMethod ?: typeof GuitarModel["bodyKeys"][number];
    stringCount ?: number;
    pickupConfiguration ?: typeof pickupConfigurationList[number];
    colorType ?: typeof bodyColorTypeList[number];
  }
  input?: {
    value : string;
    embedding : number[];
  }
  chats: { role: "assistant" | "user"; content: string }[];
}

export interface ChatStepContextArg extends Omit<IUserChatContext, "input">{
  readonly input : ({
    readonly value : string;
    readonly embedding : number[];
  })
}

export interface IMainChatStep extends MappedIntent{
  shouldSkip?(ctx : Omit<IUserChatContext, "input">) : boolean;
  generateQuestion(ctx : Omit<IUserChatContext, "input">) : Promise<StepResponse>;
  process(ctx: Omit<IUserChatContext, "input">, selected : number)  : Promise<{
    name : string;
    nameAsMessage ?: string;
    [key : string] : any;
  }>; 
}

export interface IRecommendationBranch{
  process(ctx : ChatStepContextArg ) : Promise<string | StepResponse>;
}

export interface IQuestionBranch{
  process(ctx : ChatStepContextArg ) : Promise<string>;
}
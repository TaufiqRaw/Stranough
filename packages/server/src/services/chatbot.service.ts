import {
  ChatbotError,
  DontUnderstandError,
} from "../utils/classes/chatbot.error.class";
import dotenv from "dotenv";
import { UserIntentList, envPath } from "../constants";
import { ChatStepContextArg, IMainChatStep, IUserChatContext, SelectResponse, StepResponse, UserIntent } from "../interfaces/chatbot.interface";
import { createCompletionRequestUtil } from "../utils/create-completion-request.util";
import * as R from 'remeda';
import { Optional } from "utility-types";
import { chatbotSteps } from "../chat-step/_chatbot.step";
dotenv.config({
  path: envPath,
});

const intentProcessors : {[k in UserIntent] : (ctx: Omit<IUserChatContext, 'input' | 'currentStep'> & {
  currentStep : (typeof chatbotSteps)[number]["key"];
  input : {
    value : string;
    embedding : number[];
  } 
}) => Promise<StepResponse | string>} = {
  askRecommendation: async (ctx) => {
    const step = registeredStepsMap.get(ctx.currentStep);
    if (!step) throw new ChatbotError();
    const res = step.askRecomendation ? await step.askRecomendation.process(ctx) : await defaultOnAskRecommendation(ctx);
    if(typeof res === 'string'){
      ctx.chats.push({ role: "assistant", content: res });
      return res;
    }
    ctx.chats.push({ role: "assistant", content: `${res.message}, berikut komponen yang dapat anda dipilih = ${res.itemAsMessage}` });
    return res;
  },
  askQuestion: async (ctx) => {
    const step = registeredStepsMap.get(ctx.currentStep);
    if (!step) throw new ChatbotError(); 
    const res = step.askQuestion ? await step.askQuestion.process(ctx) : await defaultOnAskQuestion(ctx) ;
    ctx.chats.push({ role: "assistant", content: res });
    return res;
  },
};

async function defaultOnAskQuestion(ctx: ChatStepContextArg): Promise<string> {
  const res = await createCompletionRequestUtil(ctx);
  return res;
}

async function defaultOnAskRecommendation(ctx: ChatStepContextArg): Promise<string> {
  const res = await createCompletionRequestUtil(ctx);
  return res;
}

export class ChatbotService {
  private userContexts = new Map<string, IUserChatContext>();

  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.getAll = () => {
        return Array
          .from(this.userContexts, ([k, v]) => `\n  ${k}: ${v}`)
          .join("") + "\n";
      };
      this.debug = (id: string) => {
        const userContext = this.userContexts.get(id);
        if (!userContext) return "Id User tidak ditemukan";
        return JSON.stringify(R.omit(userContext, ['input']), null, 2);
      };
    } 
  }

  addToAssistantChat(id: string, message: string) {
    const userContext = this.userContexts.get(id);
    if (!userContext) return;
    userContext.chats.push({ role: "assistant", content: message });
  }

  getAll?: () => string;
  debug ?: (id: string)=> string;

  public create(id: string): string {
    this.userContexts.set(id, {
      id,
      chats: [],
      selected: {},
    });
    return id;
  }

  public async start(id: string): Promise<StepResponse>{
    const userContext = this.userContexts.get(id);
    if (!userContext)
      throw new ChatbotError(
        "Id User tidak Ditemukan, Silahkan refresh halaman chatbot"
      );
    
    const firstStep = chatbotSteps[0];
    userContext.currentStep = firstStep.key;

    const question = await firstStep.instance.generateQuestion(userContext);
      userContext.chats.push({ role: "assistant", content: `${question.message}, berikut komponen yang dapat anda dipilih = [${question.itemAsMessage}]` });
    return question;
  }

  public async process(
    userId: string,
    intent: UserIntent,
    input: string,
    inputEmbedding: number[]
  ) : Promise<StepResponse | string> {
    const userContext = this.userContexts.get(userId);
    if (!userContext)
      throw new ChatbotError(
        "Id User tidak Ditemukan, Silahkan refresh halaman chatbot"
      );
    if(!userContext.currentStep) throw new ChatbotError();

    const step = registeredStepsMap.get(userContext.currentStep);
    if (!step)
      throw new ChatbotError();

    if(!input || !inputEmbedding || inputEmbedding?.length === 0)
      throw new DontUnderstandError();

    userContext.input = {
      value : input,
      embedding : inputEmbedding
    }

    let response;
    userContext.chats.push({role : 'user', content : input});
    for(const intentKey of UserIntentList){
      if(intentKey === intent){
        response = await intentProcessors[intentKey](userContext as any);
      }
    }
    console.log(response);
    if(!response) throw new DontUnderstandError();
    return response;
  }

  public async select(userId : string, selectedId : number) : Promise<SelectResponse>{
    const userContext = this.userContexts.get(userId);
    if (!userContext)
      throw new ChatbotError(
        "Id User tidak Ditemukan, Silahkan refresh halaman chatbot"
      );
    if(!userContext.currentStep) throw new ChatbotError();

    const step = registeredStepsMap.get(userContext.currentStep);
    if (!step)
      throw new ChatbotError();

    const nextStep = getNextStep(userContext.currentStep, userContext);
    const selectedItem = await step.process(userContext, selectedId);
    userContext.chats.push({ role: "user", content: `saya pilih ${selectedItem.nameAsMessage ?? selectedItem.name}` });
    if (nextStep) {
      // if this step is not the last step, then generate next question

      // Update current step
      userContext.lastStep = userContext.currentStep;
      userContext.currentStep = nextStep.key;

      const question = await nextStep.instance.generateQuestion(userContext);
      userContext.chats.push({ role: "assistant", content: `${question.message}, berikut komponen yang dapat anda dipilih = [${question.itemAsMessage}]` });
      return {...question, context : { currentStep : nextStep.key }, selectedItem};
    } else {
      // if this step is the last step
      await step.process(userContext, selectedId);
      userContext.chats.push({ role: "assistant", content: "Selesai" });
      return { message: "Selesai", context : { currentStep : userContext.currentStep }, selectedItem};
    }
  }

  public delete(id: string) {
    this.userContexts.delete(id);
  }
}

function getNextStep(currentStep: string, ctx : IUserChatContext) {
  let nextStepIndex = -1;
  const index = chatbotSteps.findIndex((step)=> step.key === currentStep);
  // if current step is not found, that means this step is last step
  if (index === chatbotSteps.length - 1) return null;

  // hypothetically, this should never happen
  if (index === -1)
    throw new ChatbotError(
      "Terjadi kesalahan pada chatbot, Silahkan refresh halaman chatbot"
    );
  
  for(let i = index + 1; i < chatbotSteps.length; i++){
    const step = chatbotSteps[i];
    if((step.instance as IMainChatStep).shouldSkip?.(ctx)) continue;
    nextStepIndex = i;
    break;
  }
  
  // if next step is not found, that means this step is the last step
  if (index === -1) return null;
  
  return chatbotSteps[nextStepIndex];
}

const registeredStepsMap = new Map<string, IMainChatStep>(
  chatbotSteps.map((step) => [step.key, step.instance])
)

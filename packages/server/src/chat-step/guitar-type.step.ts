import { DI } from "../app";
import { ChatStepContextArg, IMainChatStep, IQuestionBranch, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { ChatbotError } from "../utils/classes/chatbot.error.class";
import { createCompletionRequestUtil } from "../utils/create-completion-request.util";

const guitarTypeList = ["acoustic", "electric"] as const;

export class GuitarTypeStep implements IMainChatStep {

  async generateQuestion(ctx: Omit<IUserChatContext, "input" | "inputEmbedding">): Promise<StepResponse> {
    return {
      message : "Pilih jenis gitar yang kamu inginkan",
      total : 2,
      items : Array.from(guitarTypeList),
      itemAsMessage : "acoustic, electric"
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; }> {
    const isElectric = selected === 1
    ctx.selected.isElectric = isElectric ;
    return {
      id : selected,
      isElectric : isElectric,
      name : guitarTypeList[selected]
    };
  }
}
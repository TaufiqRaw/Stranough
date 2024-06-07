import { IMainChatStep, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { invalidInputError } from "../utils/classes/chatbot.error.class";

const stringChoice = [6, 7, 8, 9].map(v=>({
  id : v,
  name : v,
})) 

export class StringCountStep implements IMainChatStep{
  async generateQuestion(ctx: Omit<IUserChatContext, "input">): Promise<StepResponse> {
    return {
      message : "Berapa jumlah senar yang kamu inginkan?",
      items : stringChoice,
      itemAsMessage : stringChoice.map(v=>v.name).join(", "),
      total : stringChoice.length
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; nameAsMessage?: string | undefined; }> {
    if(selected < 6 || selected > 9) throw new invalidInputError();
    ctx.selected.stringCount = selected;
    return {
      id : selected,
      name : selected.toString(),
      nameAsMessage : selected.toString()
    }
  }
}
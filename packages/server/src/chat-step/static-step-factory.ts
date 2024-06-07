import { IMainChatStep, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { capitalize } from "../utils/capitalize.util";
import { invalidInputError } from "../utils/classes/chatbot.error.class";

export function staticStepFactory(itemList : readonly string[], message : string , onProcess ?:(ctx : Omit<IUserChatContext, "input">, selected: number) => void, skipCondition? : (ctx : Omit<IUserChatContext, "input">) => boolean){

  const itemDisplayNames = Object.freeze(
    itemList.map(v=>v.split("-").map(v=>capitalize(v)).join(" "))
  );

  return class {
    shouldSkip(ctx: Omit<IUserChatContext, "input">): boolean {
      return skipCondition ? skipCondition(ctx) : false;
    }
    async generateQuestion(ctx: Omit<IUserChatContext, "input" | "inputEmbedding">): Promise<StepResponse> {
      return {
        message : message,
        total : itemList.length,
        items : Array.from(itemDisplayNames),
        itemAsMessage : itemList.join(", ")
      }
    }

    async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; nameAsMessage?: string | undefined; }> {
      if(selected < 0 || selected >= itemList.length) throw new invalidInputError();
      onProcess && onProcess(ctx, selected);
      return {
        id : selected,
        name : itemList[selected],
        nameAsMessage : itemDisplayNames[selected]
      };
    }
}
}
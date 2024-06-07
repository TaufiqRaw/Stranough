import { SocketDI } from "../controllers/socket";
import { GuitarModel } from "../entities";
import { ChatStepContextArg, IMainChatStep, IRecommendationBranch, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { Satisfies } from "../interfaces/satisfies.interface";
import { invalidInputError } from "../utils/classes/chatbot.error.class";
import { createCompletionRequestUtil } from "../utils/create-completion-request.util";
import { findOneEntity } from "../utils/find-one-entity.util";

const constructionMethodWithKey : {
  id : number;
  name : string;
  originalName : typeof GuitarModel["bodyKeys"][number];
}[] = GuitarModel.bodyKeys.map((k,i)=>({
  id : i,
  name : k,
  originalName : k
}))

export class ConstructionMethodStep implements IMainChatStep{
  async generateQuestion(ctx: Omit<IUserChatContext, "input">): Promise<StepResponse> {
    const availableMethods = await getAvailableConstructionMethod(ctx);
    return {
      message : "Pilih metode konstruksi yang kamu inginkan",
      items : availableMethods,
      itemAsMessage : availableMethods.map(v=>v.name).join(", "),
      total : availableMethods.length
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; nameAsMessage?: string | undefined; }> {
    if(selected < 0 || selected >= GuitarModel.bodyKeys.length) throw new invalidInputError();
    ctx.selected.constructionMethod = GuitarModel.bodyKeys[selected];
    return {
      id : selected,
      name : GuitarModel.bodyKeys[selected],
      nameAsMessage : constructionMethodWithKey[selected].name
    }
  }
}

async function getAvailableConstructionMethod(ctx : Omit<IUserChatContext, "input">){
  const {modelId} = ctx.selected;
  if( modelId === undefined) throw new invalidInputError();

  const model = await findOneEntity(SocketDI.repository.guitarModels, modelId)

  if(!model) throw new invalidInputError();
  await model.loadBodies();

  const availableMethods = GuitarModel.bodyKeys.filter(k => model[k] !== undefined);
  const res = constructionMethodWithKey.filter(k => availableMethods.includes(k.originalName));
  if(res.length === 0) throw new Error();
  return res;
}
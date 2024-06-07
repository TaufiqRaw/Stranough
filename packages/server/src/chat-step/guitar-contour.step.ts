import { SocketDI } from "../controllers/socket";
import { GuitarBody } from "../entities";
import { IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { invalidInputError } from "../utils/classes/chatbot.error.class";
import { findOneEntity } from "../utils/find-one-entity.util";

const guitarContourWithKey : {
  id : number;
  name : string;
  originalName : typeof GuitarBody.textureKeys[number];
}[] = GuitarBody.textureKeys.map((k,i)=>({
  id : i,
  name : k,
  originalName : k
}))

export class GuitarContour{
  async generateQuestion(ctx: Omit<IUserChatContext, "input">): Promise<StepResponse> {
    const availableContour = await getAvailableContour(ctx);
    return {
      message : "Pilih kontur gitar yang diinginkan",
      items : availableContour,
      itemAsMessage : availableContour.map(v=>v.name).join(", "),
      total : GuitarBody.textureKeys.length
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; nameAsMessage?: string | undefined; }> {
    if(selected < 0 || selected >= GuitarBody.textureKeys.length) throw new invalidInputError();
    return {
      id : selected,
      name : GuitarBody.textureKeys[selected],
      nameAsMessage : guitarContourWithKey[selected].name
    }
  }
}

async function getAvailableContour(ctx : Omit<IUserChatContext, "input">){
  const {modelId, constructionMethod} = ctx.selected;
  if( modelId === undefined || constructionMethod === undefined) throw new invalidInputError();

  const model = await findOneEntity(SocketDI.repository.guitarModels, modelId)

  if(!model) throw new invalidInputError();
  await model.loadBodies();

  const availableContour = GuitarBody.textureKeys.filter(k => !!model[constructionMethod]?.[k]);
  const res = guitarContourWithKey.filter(k => availableContour.includes(k.originalName));
  if(res.length === 0) throw new Error();
  return res;
}
import { DI } from "../app";
import { SocketDI } from "../controllers/socket";
import { GuitarModel } from "../entities";
import { ChatStepContextArg, IMainChatStep, IQuestionBranch, IRecommendationBranch, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { DeadEndError, NotFoundError, invalidInputError } from "../utils/classes/chatbot.error.class";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { findOneEntity } from "../utils/find-one-entity.util";
import { poolQuery } from "../utils/pool-query.util";

export class GuitarModelStep implements IMainChatStep {
  askRecomendation = new OnAskRecommendation();

  async generateQuestion(ctx: Omit<IUserChatContext, "input">): Promise<StepResponse> {
    const repo = SocketDI.repository.guitarModels;
    let res = await repo.findAll({
      where : {
        isElectric : ctx.selected.isElectric
      }
    });
    
    if(res.length == 0){
      throw new DeadEndError();
    }

    return {
      message : "Pilih model gitar yang kamu inginkan",
      total : res.length,
      items : res,
      itemAsMessage : res.map((r : any) => r.name).join(", ")
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<GuitarModel> {
    const repo = SocketDI.repository.guitarModels;
    const res = await findOneEntity(repo, {
      id : selected,
      isElectric : ctx.selected.isElectric
    });
    if(!res)
      throw new invalidInputError();
    ctx.selected.modelId = selected;
    await res.deepLoadBodies();
    return res;
  }
}

class OnAskRecommendation implements IRecommendationBranch{
  async process(ctx: ChatStepContextArg): Promise<StepResponse> {
    let res = await poolQuery(`
      SELECT id, name, (SELECT COUNT(*) FROM guitar_model) as total
      FROM guitar_model 
      WHERE is_electric = $2
      ORDER BY embedding <-> $1
    `, [JSON.stringify(ctx.input.embedding), ctx.selected.isElectric])
    
    if(!res.rowCount || res.rowCount == 0){
      throw new invalidInputError();
    }

    return {
      message : "Berikut model gitar yang disesuaikan dengan keinginan anda",
      total : res.rows[0].total,
      items : res.rows,
      itemAsMessage : res.rows.map((r : any) => r.name).join(", ")
    }

  }
}
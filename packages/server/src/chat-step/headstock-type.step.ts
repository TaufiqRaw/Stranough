import { DI } from "../app";
import { SocketDI } from "../controllers/socket";
import { GuitarModel, Headstock } from "../entities";
import { ChatStepContextArg, IMainChatStep, IQuestionBranch, IRecommendationBranch, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { DeadEndError, NotFoundError, invalidInputError } from "../utils/classes/chatbot.error.class";
import { findAndPaginateEntity } from "../utils/find-and-paginate-entity.util";
import { findOneEntity } from "../utils/find-one-entity.util";
import { poolQuery } from "../utils/pool-query.util";

export class HeadstockTypeStep implements IMainChatStep {
  askRecomendation = new OnAskRecommendation();

  async generateQuestion(ctx: Omit<IUserChatContext, "input">): Promise<StepResponse> {
    const repo = SocketDI.repository.headstocks;
    let res = await repo.findAll();
    
    
    if(res.length == 0){
      throw new DeadEndError();
    }

    return {
      message : "Pilih jenis headstock yang kamu inginkan",
      total : res.length,
      items : res,
      itemAsMessage : res.map((r : any) => r.name).join(", ")
    }
  }

  async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<Headstock> {
    const repo = SocketDI.repository.headstocks;
    const res = await findOneEntity(repo, {
      id : selected
    });
    await res?.loadMedias();
    
    if(!res)
      throw new invalidInputError();
    ctx.selected.modelId = selected;
    return res;
  }
}

class OnAskRecommendation implements IRecommendationBranch{
  async process(ctx: ChatStepContextArg): Promise<StepResponse> {
    let res = await poolQuery(`
      SELECT id, name, (SELECT COUNT(*) FROM headstock) as total
      FROM headstock 
      ORDER BY embedding <-> $1
    `, [JSON.stringify(ctx.input.embedding)])
    
    if(!res.rowCount || res.rowCount == 0){
      throw new invalidInputError();
    }

    return {
      message : "Berikut jenis headstock yang disesuaikan dengan keinginan anda",
      total : res.rows[0].total,
      items : res.rows,
      itemAsMessage : res.rows.map((r : any) => r.name).join(", ")
    }
  }
}
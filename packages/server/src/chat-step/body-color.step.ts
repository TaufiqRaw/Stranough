// import { IMainChatStep, IUserChatContext } from "../interfaces/chatbot.interface";
// import { bodyColorTypeList } from "./static-bodies.step";

// const skippedColorType : typeof bodyColorTypeList[number][] = ['natural-transparent'];

// const bodyColorList : {[k in typeof bodyColorTypeList[number]]: string[]} = {
//   "metallic" : ["black", "white", "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "gray", "silver", "gold", "bronze"],
//   "solid" : ["black", "white", "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "gray"],
  
// };

// class BodyColorType implements IMainChatStep{
//   shouldSkip(ctx: Omit<IUserChatContext, "input">): boolean {
//     if(skippedColorType.some(v => v === ctx.selected.colorType)) return true;
//     return false;
//   }
//   async process(ctx: Omit<IUserChatContext, "input">, selected: number): Promise<{ [key: string]: any; name: string; nameAsMessage?: string | undefined; }> {
//     return {
//       name : 
//     }
//   }
// }
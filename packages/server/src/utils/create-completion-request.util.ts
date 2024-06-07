import { DI } from "../app";
import { IUserChatContext } from "../interfaces/chatbot.interface";
import { ChatbotError } from "./classes/chatbot.error.class";

export async function createCompletionRequestUtil(ctx : IUserChatContext, additionalSystemMsg : string = "", overrideSystemMsg : boolean = false){
  if(!ctx.input){
    throw new ChatbotError("Input tidak boleh kosong");
  }
  const res = await DI.openAi.chat.completions.create({
    model : "gpt-3.5-turbo",
    messages : [
      {role : "system", content : overrideSystemMsg ? additionalSystemMsg : "You are a virtual assistant at Stranough guitar technology that will help user to build a custom guitar, make sure your answer are concise and clear, no unecessary long text" + (additionalSystemMsg ? ", " + additionalSystemMsg : "")},
      ...ctx.chats,
      {role : "user", content : ctx.input.value},
    ]
  })
  if(res.choices.length === 0){
    throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  }
  if(!res.choices[0]?.message?.content){
    throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  }
  return res.choices[0].message.content;
}
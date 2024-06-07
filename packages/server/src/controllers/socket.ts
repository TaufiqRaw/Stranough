import { DI, initRepository } from "../app";
import Color from "cli-color";
import { IntentClassifierService } from "../services/intent.classifier.service";
import { ChatbotService } from "../services/chatbot.service";
import { ChatbotError, DontUnderstandError, invalidInputError } from "../utils/classes/chatbot.error.class";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { SelectResponse, StepResponse } from "../interfaces/chatbot.interface";

const chatbotService = new ChatbotService();

export const SocketDI = {
} as {
  em : EntityManager;
  repository : typeof DI.repository;
}

export function initSocket() {

  SocketDI.em = DI.orm.em.fork();
  SocketDI.repository = initRepository(SocketDI.em);

  DI.io.on("connection", async (socket) => {
    DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.green("connected")}`);

    socket.emit("get-id", chatbotService.create(socket.id));
    socket.emit("message", await chatbotService.start(socket.id));

    if(process.env.NODE_ENV === "development"){
      socket.on("debug", ()=>{
        console.log(chatbotService.debug?.(socket.id));
      })
    }

    socket.on("message", async (message : string, ack : (response : StepResponse | string) => void)=>{
      const intent = await IntentClassifierService.classify(message);
      try{
        if(!intent) throw new DontUnderstandError();
        const response = await chatbotService.process(socket.id, intent.intent, message, intent.embedding);
        ack(response);
      }catch(err){
        console.log(err);
        if(err instanceof ChatbotError){
          socket.emit("message", err.message);
          chatbotService.addToAssistantChat(socket.id, err.message);
          return;
        }else{
          socket.emit("message", "Maaf, terjadi kesalahan pada sistem chatbot");
          chatbotService.addToAssistantChat(socket.id, "Maaf, terjadi kesalahan pada sistem chatbot");
          return;
        }
      }
    });

    socket.on("select-component", async (selected : number, ack : (res :SelectResponse)=>void)=>{
      try{
        if(typeof selected !== "number") throw new invalidInputError();
        ack(await chatbotService.select(socket.id, selected));
      }catch(err){
        console.log(err);
        if(err instanceof ChatbotError){
          socket.emit("message", err.message);
          chatbotService.addToAssistantChat(socket.id, err.message);
          return;
        }else{
          socket.emit("message", "Maaf, terjadi kesalahan pada sistem chatbot");
          chatbotService.addToAssistantChat(socket.id, "Maaf, terjadi kesalahan pada sistem chatbot");
          return;
        }
      }
    })
    
    socket.on("disconnect", () => {
      chatbotService.delete(socket.id);
      DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.red("disconnected")}`);
    });

  });
}

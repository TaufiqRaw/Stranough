import { DI, initRepository } from "../app";
import Color from "cli-color";
import { IntentClassifierService } from "../services/intent.classifier.service";
import { ChatbotError, DontUnderstandError, invalidInputError } from "../utils/classes/chatbot.error.class";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { ChatbotService } from "../services/chatbot.service";
import { GuitarBuilder } from "stranough-common";

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
    for (const {i, msg} of chatbotService.start(socket.id).map((msg, i) => ({msg, i}))){
      setTimeout(()=>{
        socket.emit("message", msg);
      }, i * 200)
    }

    socket.on("message", async (message : string, ack : (response : any) => void)=>{
      try{
        ack(await chatbotService.ask(socket.id, message));
      }catch(e){
        if(e instanceof ChatbotError){
          ack(e.message);
        }else{
          ack("Terjadi kesalahan pada server, silahkan refresh halaman dan coba lagi.");
        }
      }
    });

    socket.on("select-component", async (selected : {
      component : keyof GuitarBuilder.SelectedItem,
      value : any
    }, ack : (res :any)=>void)=>{
      const response = chatbotService.selectComponent(socket.id, selected);
      ack({message : response});
    })
    
    socket.on("disconnect", () => {
      // chatbotService.delete(socket.id);
      DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.red("disconnected")}`);
    });

  });
}

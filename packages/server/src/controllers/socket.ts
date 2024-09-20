import { DI, initRepository } from "../app";
import Color from "cli-color";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { AssistantSocket, GuitarBuilder } from "stranough-common";
import { AssistantService } from "../services/assistant.service";
import {OpenAI} from "openai";
import { IUserChatContext } from "../interfaces/user-chat-context";
import { findOneEntity } from "../utils/find-one-entity.util";

export const SocketDI = {
  openai : new OpenAI(),
} as {
  em : EntityManager;
  repository : typeof DI.repository;
  openai : OpenAI;
}

const noOpenAITest = false;

export function initSocket() {

  const assistantService = new AssistantService();

  SocketDI.em = DI.orm.em.fork();
  SocketDI.repository = initRepository(SocketDI.em);

  DI.io.on("connection", async (socket) => {
    DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.green("connected")}`);
    assistantService.create(socket.id);

    socket.emit("id", {
      id : socket.id
    })

    socket.on("load-order", async (orderId : number, ack : (res : boolean)=>void)=>{
      try{
        const order = await findOneEntity(SocketDI.repository.orders, orderId);
        if(!order){
          throw new Error("Order not found");
        }
        assistantService.load(socket.id, order);
        ack(true);
      }catch(e){
        DI.logger.error(e);
        ack(false);
      }
    });

    socket.on("select-component", async (selected : {
      component : GuitarBuilder.SelectedItemKeys,
      name ?: string,
      key ?: string | boolean
    }, ack : (res :boolean)=>void)=>{
      console.log(selected);
      try{
        if(selected.key && selected.name){
          assistantService.select(socket.id, selected.component, selected.name, selected.key);
        }else{
          assistantService.clearComponent(socket.id, selected.component);
        }
        ack(true);
      }catch(e){
        console.error(e);
        ack(false);
      }
    })

    socket.on("get-selected-items", async (ack : (res : any)=>void)=>{
      const res = assistantService.getSelectedComponent(socket.id);
      ack(res);
    })

    socket.on("get-selected-item-names", async (ack : (res : any)=>void)=>{
      const res = assistantService.getSelectedComponentName(socket.id);
      ack(res);
    })

    socket.on("upload-pref", async (description : string, imgLength : number | undefined, ack : (res :boolean)=>void)=>{
      if(noOpenAITest){
        ack(true);
        return;
      }

      try{
        await assistantService.uploadPref(socket.id, description, imgLength);
        ack(true);
      }catch(e){
        ack(false);
      }
    })

    socket.on("ask-recommendation", async (component : GuitarBuilder.SelectedItemKeys, ack : (res : AssistantSocket.askRecommendationResponse)=>void)=>{
      if(noOpenAITest){
        ack({
          message : "Test",
          recommendations : []
        });
        return;
      }

      try{
        const res = await assistantService.askRecommendation(socket.id, component);
        console.log(res);
        ack(res);
      }catch(e){
        console.error(e);
        ack({
          message : "Error",
          recommendations : []
        });
      }
    })
    
    socket.on("disconnect", async () => {
      try{
        assistantService.delete(socket.id);
      }catch(e){
        DI.logger.error(e);
      }
        
      DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.red("disconnected")}`);
    });

  });
}
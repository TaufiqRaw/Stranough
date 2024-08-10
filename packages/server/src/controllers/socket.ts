import { DI, initRepository } from "../app";
import Color from "cli-color";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { AssistantSocket, GuitarBuilder } from "stranough-common";
import { AssistantService } from "../services/assistant.service";
import {OpenAI} from "openai";

const assistantService = new AssistantService();

export const SocketDI = {
  openai : new OpenAI(),
} as {
  em : EntityManager;
  repository : typeof DI.repository;
  openai : OpenAI;
}

const noOpenAITest = false;

export function initSocket() {

  SocketDI.em = DI.orm.em.fork();
  SocketDI.repository = initRepository(SocketDI.em);

  DI.io.on("connection", async (socket) => {
    DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.green("connected")}`);
    assistantService.create(socket.id);

    socket.emit("id", {
      id : socket.id
    })

    socket.on("select-component", async (selected : {
      component : GuitarBuilder.SelectedItemKeys,
      name : string,
      key : string | boolean
    }, ack : (res :boolean)=>void)=>{
      try{
        assistantService.select(socket.id, selected.component, selected.name, selected.key);
        ack(true);
      }catch(e){
        console.error(e);
        ack(false);
      }
    })

    socket.on("upload-image", async (ack : (res :boolean)=>void)=>{
      if(noOpenAITest){
        ack(true);
        return;
      }

      try{
        await assistantService.uploadImage(socket.id);
        ack(true);
      }catch(e){
        console.error(e);
        ack(false);
      }
    })
    socket.on("describe-guitar", async (description : string, ack : (res :boolean)=>void)=>{
      if(noOpenAITest){
        ack(true);
        return;
      }

      try{
        await assistantService.describeGuitar(socket.id, description);
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
      await assistantService.delete(socket.id);
      DI.logger.info(`${Color.green("[Socket]")} a user with id : ${socket.id} has ${Color.red("disconnected")}`);
    });

  });
}
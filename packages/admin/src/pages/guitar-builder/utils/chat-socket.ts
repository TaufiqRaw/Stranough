import { io } from "socket.io-client";
import { Owner, createMemo, createSignal, runWithOwner } from "solid-js";
import { Chatbot, ChatbotCommonResponse, ChatbotSelectResponse, Satisfies } from "stranough-server";
import { createSignalObjectArray } from "~/commons/functions/signal-object.util";
import { IGuitarComponent } from "./types";
import { createModel } from "~/pages/admin/model-editor/utils/functions/create-model";
import { Constants } from "~/constants";
import { useSelectedGuitarComponent } from "../guitar-builder";
import { createHeadstock } from "~/pages/admin/headstock-editor/utils/create-headstock";
import { GuitarBody } from "stranough-server/dist/entities";

const onSelectProcessor : {[k in Chatbot.ChatbotStepsType] ?: (owner : Owner,selectedComponent : IGuitarComponent,selectedItem : any)=>void}={
  "guitar-type" : (o, c, i)=>{
    c.isElectric.set(i.isElectric);
  },
  "guitar-model" : (o, c, i)=>{
    runWithOwner(o, ()=>{
      c.guitarModel.set(createModel(i));
    });
  },
  "orientation" : (o, c, i)=>{
    c.isLeftHanded.set(!!i.id);
  },
  "guitar-contour" : (o,c,i : {name : typeof GuitarBody.textureKeys[number]})=>{
    c.guitarModel.get()?.getSelectedBodySignal()?.selectedBodyTexture.set(i.name);
  },
  "headstock-type" : (o, c, i)=>{
    runWithOwner(o, ()=>{
      console.log(i);
      c.headstock.set(createHeadstock(i));
    })
  },
}

export function chatSocket(props : {
  owner : Owner,
}){
  const selectedComponent = useSelectedGuitarComponent()!;
  const {
    add : addMessage,
    state : _messages,
  } = createSignalObjectArray<{data : string | Omit<ChatbotCommonResponse, 'itemAsMessage'> , isUser : boolean}>([]);

  const messages = createMemo(()=>_messages().map(m=>m.get()));

  const [status, setStatus] = createSignal<'success' | 'error' | 'connecting'>('connecting');
  const [isAnswering, setIsAnswering] = createSignal(false);
  const socket = io(Constants.serverUrl);

  socket.on('connect', () => {
    setStatus('success');
  });

  socket.on('connect_error', (err) => {
    console.log('socket error', err);
    setStatus('error');
  });

  socket.on('message', (message : string | ChatbotCommonResponse)=>{
    if(typeof message === 'string'){
      return addMessage({data: message, isUser : false});
    } else {
      return addMessage({data : message, isUser : false});
    }
  });

  function selectComponent(id : number){
    setIsAnswering(true);
    socket.emit('select-component', id, (response : ChatbotSelectResponse)=>{
      setIsAnswering(false);
      onSelectProcessor[selectedComponent.context.get()]?.(props.owner, selectedComponent, response.selectedItem);
      selectedComponent.context.set(response.context.currentStep);
      if(response.items){
        addMessage({data : {
          message : response.message,
          items : response.items,
          total : response.total!,
        }, isUser : false})
      }else{
        addMessage({data : response.message, isUser : false})
      }
    });
  }

  function sendMessage(message : string){
    setIsAnswering(true);
    addMessage({data : message, isUser : true});
    socket.emit('message', message, (response : ChatbotCommonResponse | string)=>{
      setIsAnswering(false);
      if(typeof response === 'string'){
        addMessage({data : response, isUser : false});
      } else {
        addMessage({data : {
          message : response.message,
          items : response.items,
          total : response.total,
        }, isUser : false})
      }
    });
  }

  return {
    messages,
    status,
    isAnswering,
    selectComponent,
    sendMessage,
  }
}
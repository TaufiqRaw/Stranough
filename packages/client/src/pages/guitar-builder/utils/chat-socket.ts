import { io } from "socket.io-client";
import { Owner, createMemo, createSignal, runWithOwner } from "solid-js";
import { createSignalObjectArray } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { createModel } from "~/pages/admin/electric-model-editor/utils/functions/create-model";
import { Constants } from "~/constants";
import { useGuitarBuilderContext } from "../guitar-builder";
import { createHeadstock } from "~/pages/admin/headstock-editor/utils/create-headstock";
import { GuitarBody } from "stranough-server/dist/entities";
import { GuitarBuilder } from "stranough-common";
import { createBridge } from "~/pages/admin/bridge-editor/utils/create-bridge";
import { createJack } from "~/pages/admin/jack-editor/utils/create-jack";
import { createKnob } from "~/pages/admin/knob-editor/utils/create-knob";
import { createPeg } from "~/pages/admin/peg-editor.ts/utils/create-peg";

export function chatSocket(props : {
  owner : Owner,
  guitarComponent : Omit<IGuitarBuilder, 'socket' | 'isBottomSideMenuSwiped'>,
}){
  const selectedComponent = useGuitarBuilderContext()!;
  const {
    add : addMessage,
    state : _messages,
    setState : setMessages,
  } = createSignalObjectArray<{data : {
    message : string,
    metadata ?: {[k : string] : any}
  } , isUser : boolean}>([]);

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

  socket.on('message', (message : string)=>{
    return addMessage({data: {
      message,
    }, isUser : false});
  });

  function selectComponent(component : keyof GuitarBuilder.SelectedItem, value : any){
    setIsAnswering(true);
    socket.emit('select-component', {
      component,
      value,
    }, (response : any)=>{
      setIsAnswering(false);
      setMessages([..._messages().filter(m=>m.get().data.metadata?.type !=='guide')])
      addMessage({data : {
        message : response.message,
        metadata: {
          type : 'guide'
        }
      }, isUser : false});
    });
  }

  function sendMessage(message : string){
    setIsAnswering(true);
    addMessage({data : {message}, isUser : true});
    socket.emit('message', message, (response : any)=>{
      setIsAnswering(false);
      if(typeof response === 'string'){
        addMessage({data : {message : response}, isUser : false});
      }else{
        if(response.metadata){
          addMessage({data : response.message, isUser : false});
        }else{
          let res = response as {[k in keyof GuitarBuilder.SelectedItem] ?: any};
          console.log(res);
          if(res.guitarModel)
            props.guitarComponent.guitarModel.set(createModel(res.guitarModel));
          if(res.constructionMethod)
            props.guitarComponent.constructionMethod.set(res.constructionMethod);
          if(res.headstock)
            props.guitarComponent.headstock.set(createHeadstock(res.headstock));
          if(res.backContour)
            props.guitarComponent.backContour.set(res.backContour);
          if(res.topContour)
            props.guitarComponent.topContour.set(res.topContour);
          if(res.bridge)
            props.guitarComponent.bridge.set(createBridge(res.bridge));
          if(res.jack)
            props.guitarComponent.jack.set(createJack(res.jack));
          if(res.knob)
            props.guitarComponent.knob.set(createKnob(res.knob));
          if(res.peg)
            props.guitarComponent.peg.set(createPeg(res.peg));
          if(res.bodyColorType && GuitarBuilder.bodyColorType.some(b=>b.key === res.bodyColorType)){
            props.guitarComponent.bodyColorType.set(res.bodyColorType);
          }
          if(res.neckWood && GuitarBuilder.neckWoods.some(b=>b.key === res.neckWood)){
            props.guitarComponent.neckWood.set(res.neckWood);
          }
  
          addMessage({data : {
            message  : "Gitar telah diubah sesuai dengan masukkan"
          }, isUser : false});
        }
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
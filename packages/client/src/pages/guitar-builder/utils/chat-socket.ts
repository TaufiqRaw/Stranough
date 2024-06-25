import { io } from "socket.io-client";
import { Owner, createMemo, createSignal, runWithOwner } from "solid-js";
import { createSignalObjectArray } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { Constants } from "~/constants";
import { useGuitarBuilderContext } from "../guitar-builder";
import { createHeadstock } from "~/pages/admin/headstock-editor/utils/create-headstock";
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

  return {
    messages,
    status,
    isAnswering,
    selectComponent,
  }
}
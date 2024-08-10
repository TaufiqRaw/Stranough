import { io } from "socket.io-client";
import { createSignal } from "solid-js";
import { AssistantSocket, GuitarBuilder } from "stranough-common";
import { Constants } from "~/constants";

//TODO: add timeout for selectItem and askRecommendation
export function createAssistantSocket(){
  const socket = io(Constants.serverUrl);
  const [status, setStatus] = createSignal<'success' | 'error' | 'connecting'>('connecting');
  const [id,setId] = createSignal<string>();

  socket.on("id", (ack : {
    id : string
  }) => {
    setId(ack.id);
  });

  socket.on('connect', () => {
    setStatus('success');
  });

  socket.on('connect_error', (err) => {
    console.log('socket error', err);
    setStatus('error');
  });

  function selectItem(component : GuitarBuilder.SelectedItemKeys, selected : {name : string, key : string | boolean}) : Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('select-component', {component, ...selected}, (success : boolean) => {
        resolve(success);
      });
    });
  }

  function describeGuitar(description : string) : Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('describe-guitar', description, (success : boolean) => {
        resolve(success);
      });
    });
  }

  function askRecommendation(component : GuitarBuilder.SelectedItemKeys) : Promise<AssistantSocket.askRecommendationResponse>{
    return new Promise<AssistantSocket.askRecommendationResponse>((resolve, reject) => {
      socket.emit('ask-recommendation', component, (recommendations : AssistantSocket.askRecommendationResponse) => {
        resolve(recommendations);
      });
    });
  }

  function uploadImage(){
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('upload-image', (ack : boolean) => {
        resolve(ack);
      });
    });
  }

  return {selectItem, askRecommendation, status, describeGuitar, id, uploadImage};
}
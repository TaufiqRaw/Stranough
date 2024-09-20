import { io } from "socket.io-client";
import { createSignal } from "solid-js";
import { AssistantSocket, GuitarBuilder } from "stranough-common";
import { Order } from "stranough-server/dist/entities";
import { Constants } from "~/constants";

//TODO: add timeout for selectItem and askRecommendation
export function createAssistantSocket(){
  const socket = io(Constants.serverUrl);
  const [status, setStatus] = createSignal<'success' | 'error' | 'connecting'>('connecting');
  const [id,setId] = createSignal<string>();
  const [preferencesDescription, setPreferencesDescription] = createSignal<string>();
  const [prefImgLength, setPrefImgLength] = createSignal<number>();

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

  function reconnect(){
    socket.connect();
    setStatus('connecting');
  }

  function loadOrder(order : Order){
    setPreferencesDescription(order.preferencesDescription);
    setStatus('connecting')
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('load-order', order.id, (success : boolean) => {
        if(success){
          setStatus('success');
        }else{
          setStatus('error');
        }
        resolve(success);
      });
    });
  }

  function getSelectedItemNames() : Promise<{
    [k : string] : string
  }>{
    return new Promise<{
      [k : string] : string
    }>((resolve, reject) => {
      socket.emit('get-selected-item-names', (names : {
        [k : string] : string
      }) => {
        resolve(names);
      });
    });
  }
  
  function getSelectedItems() : Promise<any>{
    return new Promise<any>((resolve, reject) => {
      socket.emit('get-selected-items', (items : any) => {
        resolve(items);
      });
    });
  }

  function selectItem(component : GuitarBuilder.SelectedItemKeys, selected ?: {name : string, key : string | boolean}) : Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('select-component', {component, ...selected}, (success : boolean) => {
        resolve(success);
      });
    });
  }

  function uploadPref(description : string, imgLength ?: number) : Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      socket.emit('upload-pref', description, imgLength, (success : boolean) => {
        setPreferencesDescription(description);
        setPrefImgLength(imgLength);
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

  function askFeedback() : Promise<string>{
    return new Promise<string>((resolve, reject) => {
      socket.emit('ask-feedback', (ack : string) => {
        resolve(ack);
      });
    });
  }

  return {selectItem, askRecommendation, status, uploadPref, id, reconnect, askFeedback, preferencesDescription, prefImgLength, getSelectedItemNames, getSelectedItems, loadOrder};
}
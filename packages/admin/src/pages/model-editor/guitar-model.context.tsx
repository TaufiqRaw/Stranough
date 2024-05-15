import {axios} from "~/commons/axios-instance";
import { Accessor, JSX, Match, Setter, Show, Signal, Switch, batch, createContext, createMemo, createSignal, onMount, useContext } from "solid-js";
import { createSignalObject, signalObjectfromSignal } from "~/commons/functions/signal-object.util";
import { ServerDtos, ServerEntities } from "stranough-server";
import { GuitarBody, GuitarModelBodyKeyType, GuitarModel, GuitarBodyTexture } from "./utils/types";
import { createGuitarBody } from "./utils/function/create-guitar-body.util";
import { GuitarModelDto } from "stranough-server/dist/dtos";
import { useQueryClient } from "@tanstack/solid-query";

//set the signal to null if the entity mark to be deleted

const GuitarModelSignalContext = createContext<GuitarModel>();

//TODO: add validation for mask
function bodyTextureToServerDto(texture : GuitarBodyTexture | null | undefined) : ServerDtos.GuitarBodyTextureDto | undefined | null{
  if(!texture) return texture;
  return {
    scale : texture.scale.get() || 1,
    backMask : texture.backMask.get()?.id,
    backShadowTexture : texture.backShadowTexture.get()?.id,
    backSpecularTexture : texture.backSpecularTexture.get()?.id,
    frontHoleMask : texture.frontHoleMask.get()?.id,
    mask : texture.mask.get()?.id!,
    frontShadowTexture : texture.frontShadowTexture.get()?.id,
    frontSpecularTexture : texture.frontSpecularTexture.get()?.id,
  }
}

function guitarBodyToServerDto(body : GuitarBody | null | undefined) : ServerDtos.GuitarBodyDto | undefined | null{
  if(!body) return body;
  //TODO: add validator for bridge, fingerboard
  const knobs = body.spawnPoints.knobs.get().filter(x=>x.get()).map(x=>x.get()!);
  const switchSp = body.spawnPoints.switch.position.get();
  const topJack = body.spawnPoints.jack.top.position.get();
  const sideJack = body.spawnPoints.jack.side.position.get();
  return {
    bridgeSpawnPoint : body.spawnPoints.bridge.position.get()!,
    fingerboardSpawnPoint : body.spawnPoints.fingerboard.position.get()!,
    pickupSpawnPoint : {
      neck : body.spawnPoints.pickup.neck.position.get(),
      bridge : body.spawnPoints.pickup.bridge.position.get(),
      middle : body.spawnPoints.pickup.middle.position.get(),
    },
    knobSpawnPoint : knobs.length > 0 ? knobs : undefined,
    switchSpawnPoint : switchSp ? {...switchSp, rotation : body.spawnPoints.switch.rotation.get()} : undefined,
    topJackSpawnPoint : topJack ? {...topJack, rotation : body.spawnPoints.jack.top.rotation.get()} : undefined,
    sideJackSpawnPoint : sideJack ? {...sideJack, rotation : body.spawnPoints.jack.side.rotation.get()} : undefined,
    carvedTopBackTexture : bodyTextureToServerDto(body.carvedTopBackTexture.get()),
    carvedTopTexture : bodyTextureToServerDto(body.carvedTopTexture.get()),
    carvedTopTummyCutTexture : bodyTextureToServerDto(body.carvedTopTummyCutTexture.get()),
    flatTopBackTexture : bodyTextureToServerDto(body.flatTopBackTexture.get()),
    forearmCutTexture : bodyTextureToServerDto(body.forearmCutTexture.get()),
    forearmTummyCutTexture : bodyTextureToServerDto(body.forearmTummyCutTexture.get()),
    tummyCutTexture : bodyTextureToServerDto(body.tummyCutTexture.get()),
  }
}

export function GuitarModelSignalProvider(props : {
  children : JSX.Element,
  id ?: number,
}){
  const queryClient = useQueryClient();
  const [status, setStatus] = createSignal<"loading" | "error" | "success" | "idle">();
  const [isMutating, setIsMutating] = createSignal(false);
  const [selectedBody, setSelectedBody] = createSignal<GuitarModelBodyKeyType | undefined>();
  const signal : GuitarModel = {
    id : createSignalObject(),
    name : createSignalObject("Model Name"),
    description : createSignalObject("Model Description"),
    selectedBody : {
      get : selectedBody,
      set : (x)=>{
        if(!!x && !signal[x].get()){
          signal[x].set(createGuitarBody());
        }
        setSelectedBody(x);
    }},
    getSelectedBodySignal: createMemo(()=>{
      if(!selectedBody()) return undefined;
      return signal[selectedBody()!].get();
    }),
    neckThroughBody : createSignalObject<GuitarBody | null>(),
    setInBody : createSignalObject<GuitarBody | null>(),
    boltOnBody : createSignalObject<GuitarBody | null>(),
    async save(){
      if(isMutating())
        return;
      setIsMutating(true);
      try{
        if(!signal.id.get()){
          // if model doesn't have id, create new model
          const res = await axios.post<ServerEntities.GuitarModel>(`guitar-models`, {
            description : signal.description.get(),
            name : signal.name.get(),
            boltOnBody : guitarBodyToServerDto(signal.boltOnBody.get()),
            neckThroughBody : guitarBodyToServerDto(signal.neckThroughBody.get()),
            setInBody : guitarBodyToServerDto(signal.setInBody.get()),
          });
          signal.id.set(res.data.id);
        }else{
          // if model has id, update model
          await axios.put<void>(`guitar-models/${signal.id.get()}`, {
            description : signal.description.get(),
            name : signal.name.get(),
            boltOnBody : guitarBodyToServerDto(signal.boltOnBody.get()),
            neckThroughBody : guitarBodyToServerDto(signal.neckThroughBody.get()),
            setInBody : guitarBodyToServerDto(signal.setInBody.get()),
          });
        }

        queryClient.invalidateQueries({
          queryKey : ["guitar-models"]
        });
      }catch(err){
        //TODO: add error message
        console.log(err)
      }
      setIsMutating(false);
    }
  }

  async function loadModel(){
    if(status() === "loading") return;
    setStatus("loading");
    if(!props.id){
      signal.id.set(undefined);
      signal.name.set("Model Name");
      signal.description.set("Model Description");
      signal.boltOnBody.set();
      signal.neckThroughBody.set();
      signal.setInBody.set();
      setStatus("success");
    }else{
      try{
        const {data} = await axios.get<ServerEntities.GuitarModel>(`guitar-models/${props.id}`);

        signal.id.set(data.id);
        signal.name.set(data.name);
        signal.description.set(data.description);
        signal.boltOnBody.set(data.boltOnBody ? createGuitarBody(data.boltOnBody) : undefined);
        signal.neckThroughBody.set(data.neckThroughBody ? createGuitarBody(data.neckThroughBody) : undefined);
        signal.setInBody.set(data.setInBody ? createGuitarBody(data.setInBody) : undefined);
        
        setStatus("success");
      }catch(err){
        setStatus("error");
        //TODO: add error message
      }
    }
  }
  
  onMount(async ()=>{
    loadModel();
  })

  //TODO: ui rework
  return <GuitarModelSignalContext.Provider value={signal}>
    <Switch fallback={<></>}>
      <Match when={status() === "loading"}>
        <div>Loading</div>
      </Match>
      <Match when={status() === "error"}>
        <div>Error</div>
        {/*TODO: reload button*/}
      </Match>
      <Match when={status() === "success"}>
        {props.children}
      </Match>
    </Switch>
  </GuitarModelSignalContext.Provider>
} 

export function useGuitarModelSignal(){
  return useContext(GuitarModelSignalContext)!;
}
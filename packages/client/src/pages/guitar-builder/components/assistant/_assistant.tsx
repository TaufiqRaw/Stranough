import { Accessor, For, Match, Setter, Show, Switch, createContext, createMemo, createSignal, useContext } from "solid-js";
import { AssistantStepsController } from "./assistant-steps-controller";
import { Button } from "./utils/button";
import { CaptionedToggleableButton } from "./utils/captioned-toggleable-button";
import { AssistMode } from "./steps/assist-mode";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { assistantStepKeys, assistantStepKeysType, assistantSteps } from "./assistant-steps";
import { createAssistantSocket } from "./utils/assistant-socket";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { AssistantSocket, ElectricModel, GuitarBuilder } from "stranough-common";
import { WhereToClickAssist } from "./utils/where-to-click-assist";
import { Spinner } from "~/commons/components/spinner";
import { Summary } from "./steps/summary";
import { ServerDtos, ServerEntities } from "stranough-server";
import { axios } from "~/commons/axios-instance";
import { AxiosResponse } from "axios";
import { Texture } from "pixi.js";

export const AssistantCtx = createContext<{
  assistantSocket : ReturnType<typeof createAssistantSocket>,
  assistantStepsController : AssistantStepsController,
  nextStepCandidate : SignalObject<assistantStepKeysType | undefined>
  setOnNextButtonClick : Setter<(() => (Promise<void> | void)) | undefined>,
  assistantContainer : Accessor<HTMLDivElement | undefined>,
  setSpotlightNextBtn : Setter<boolean>,
  cachedRecommendations : SignalObject<{[x : string] : AssistantSocket.askRecommendationResponse}>
  orderId : Accessor<number | undefined>
}>();

export function Assistant(
  props : {
    setOnSave : Setter<(()=>Promise<void>) | undefined>,
    id ?: number,
    orderDetail ?: ServerEntities.Order,
    renderFront : Accessor<(()=>Promise<HTMLImageElement| undefined>)>,
    renderBack : Accessor<(()=>Promise<HTMLImageElement| undefined>)>,
  }
){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const assistantStepsController = new AssistantStepsController(guitarBuilderCtx,assistantSteps);
  const nextStepCandidate = createSignalObject<assistantStepKeysType>();
  const assistantSocket = createAssistantSocket();
  const [onNextButtonCtx, setOnNextButtonClick] = createSignal<()=>(Promise<void> | void)>();
  const [errorMsg, setErrorMsg] = createSignal<string>();
  const [isFinished, setIsFinished] = createSignal(false);
  const [assistantContainer, setAssistantContainer] = createSignal<HTMLDivElement>();
  const [spotlightNextBtn, setSpotlightNextBtn] = createSignal(false);
  const cachedRecommendations = createSignalObject({} as any);
  const [id, setId] = createSignal<number | undefined>(props.id);

  async function loadOrder(orderDetail : ServerEntities.Order){
    await assistantSocket.loadOrder(orderDetail);
    if(orderDetail.isFinished)
      setIsFinished(true);
    else if(orderDetail.lastStep)
      assistantStepsController.setSteps(orderDetail.lastStep);
  }

  if(props.orderDetail) {
    loadOrder(props.orderDetail);
  }

  props.setOnSave(()=>async()=>{
    if(!id()){
      const res = await axios.post<ServerDtos.OrderDto, AxiosResponse<number>>('/orders', {
        preferencesDescription : assistantSocket.preferencesDescription(),
        isFinished : isFinished(),
        preferencesImgLength : assistantSocket.prefImgLength(),
        lastStep : assistantStepsController.getCurrentStepKey(),
        oldId : assistantSocket.id(),
        selectedItemNames : await assistantSocket.getSelectedItemNames() as any,
        selectedItems : await assistantSocket.getSelectedItems() as any,
      } as ServerDtos.OrderDto);
      setId(res.data);
    }else{
      const res = await axios.put<ServerDtos.OrderDto, AxiosResponse<number>>('/orders/' + id(), {
        preferencesDescription : assistantSocket.preferencesDescription(),
        isFinished : isFinished(),
        preferencesImgLength : assistantSocket.prefImgLength(),
        lastStep : assistantStepsController.getCurrentStepKey(),
        selectedItemNames : await assistantSocket.getSelectedItemNames() as any,
        selectedItems : await assistantSocket.getSelectedItems() as any,
      } as ServerDtos.OrderDto);
    }
  })

  async function onNextButtonClick(){
    try{
      onNextButtonCtx() && await onNextButtonCtx()!();
      setOnNextButtonClick(undefined);
    }catch(e){
      console.error(e);
      if(e instanceof Error)
        return setErrorMsg(e.message);
      else{
        return setErrorMsg('Terjadi kesalahan');
      }
    }
    const nextStep = nextStepCandidate.get();
    if(!nextStep) return;
    
    nextStepCandidate.set(undefined);
    if(nextStep === assistantStepKeys.next) {
      if(assistantStepsController.isNextFinished()){
        const confirmed = confirm('Jika Anda yakin dengan pilihan Anda, klik OK untuk memesan gitar ini');
        if(!confirmed) return nextStepCandidate.set(nextStep);
      }
      const nextRes = assistantStepsController.next();
      if(nextRes === 'finished'){
        setIsFinished(true);
        await guitarBuilderCtx.saveGuitar();
        return;
      }
    }else assistantStepsController.setSteps(nextStep!);
    await guitarBuilderCtx.saveGuitar();
  }
  return <div class="h-full p-2">
    <div class="bg-gray-800 h-full w-full rounded-md text-white-950 relative">
      <AssistantCtx.Provider value={
        {assistantStepsController, nextStepCandidate, assistantSocket, setOnNextButtonClick, assistantContainer, setSpotlightNextBtn, cachedRecommendations, orderId : id}
      }>
        <Switch>
          <Match when={assistantSocket.status() === 'connecting'}>
            <div class="h-full w-full grid items-center">
              <Spinner/>
            </div>
          </Match>
          <Match when={assistantSocket.status() === 'error'}>
            <div class="p-2 grid items-center">
              <div class="text-center">Terjadi kesalahan, silahkan muat ulang halaman</div>
              <Button onClick={assistantSocket.reconnect}>
                Muat Ulang
              </Button>
            </div>
          </Match>
          <Match when={assistantSocket.status() === 'success'}>
            <Show when={errorMsg()}>
              <div class="absolute left-1/2 transform -translate-x-1/2 p-2 rounded-md top-2 w-full z-[11]">
                <div class="p-2 bg-red-500 rounded-lg">
                  {errorMsg()}
                </div>
              </div>
              <div class="absolute left-0 top-0 bg-black opacity-40 w-full h-full z-10" onClick={()=>setErrorMsg(undefined)}/>
            </Show>
            
            <div class="overflow-y-auto overflow-x-hidden h-full" ref={setAssistantContainer} >
              <Show when={!isFinished()}>
                <div class={"p-2 flex flex-col gap-2 " + (nextStepCandidate.get() ? 'mb-28' : 'mb-14')}>
                  {assistantStepsController.getCurrentStep()()}
                </div>
              </Show>
              <Show when={isFinished()}>
                <Summary
                  renderFront={props.renderFront}
                  renderBack={props.renderBack}
                />
              </Show>
            </div>
            <Show when={!isFinished()}>
              <div class="absolute bottom-0 p-2 px-2 bg-gray-800 z-[1] rounded-md flex flex-col w-full gap-2">
                <Show when={nextStepCandidate.get()}>
                  <WhereToClickAssist active={
                    spotlightNextBtn()
                  } onClick={()=>{
                    setSpotlightNextBtn(false);
                  }}>
                    <Button class="w-full bg-blue-500 text-white !border-none" onClick={onNextButtonClick}>
                      Lanjut
                    </Button>
                  </WhereToClickAssist>
                </Show>
                <Show when={
                  assistantStepsController.backable()
                }>
                  <Button class="w-full bg-transparent text-blue-500 !border-blue-500" onClick={()=>assistantStepsController.back()}>
                    Kembali
                  </Button>
                </Show>
              </div>
            </Show>
          </Match>
        </Switch>
      </AssistantCtx.Provider>
    </div>
  </div>
}

export function useAssistant(){
  return useContext(AssistantCtx)!;
}
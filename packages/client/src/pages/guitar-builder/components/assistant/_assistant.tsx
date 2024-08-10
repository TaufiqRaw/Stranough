import { For, Setter, Show, createContext, createSignal, useContext } from "solid-js";
import { AssistantStepsController } from "./assistant-steps-controller";
import { Button } from "./utils/button";
import { CaptionedToggleableButton } from "./utils/captioned-toggleable-button";
import { AssistMode } from "./steps/assist-mode";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { assistantStepKeys, assistantStepKeysType, assistantSteps } from "./assistant-steps";
import { createAssistantSocket } from "./utils/assistant-socket";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { ElectricModel, GuitarBuilder } from "stranough-common";
import { priceFormat } from "~/commons/functions/price-format";
import * as R from 'remeda';

const AssistantCtx = createContext<{
  assistantSocket : ReturnType<typeof createAssistantSocket>,
  assistantStepsController : AssistantStepsController,
  nextStepCandidate : SignalObject<assistantStepKeysType | undefined>
  setOnNextButtonClick : Setter<(() => (Promise<void> | void)) | undefined>
}>();

export function Assistant(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const assistantStepsController = new AssistantStepsController(guitarBuilderCtx,assistantSteps);
  const nextStepCandidate = createSignalObject<assistantStepKeysType>();
  const assistantSocket = createAssistantSocket();
  const [onNextButtonCtx, setOnNextButtonClick] = createSignal<()=>(Promise<void> | void)>();
  const [errorMsg, setErrorMsg] = createSignal<string>();
  const [isFinished, setIsFinished] = createSignal(false);

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
    if(nextStep === assistantStepKeys.next) {
      const nextRes = assistantStepsController.next();
      if(nextRes === 'finished'){
        setIsFinished(true);
        return;
      }
    }else assistantStepsController.setSteps(nextStep!);
    
    nextStepCandidate.set(undefined);
  }
  return <div class="h-full p-2">
    <div class="bg-gray-800 h-full w-full rounded-md text-white-950 relative">
      <Show when={errorMsg()}>
        <div class="absolute left-1/2 transform -translate-x-1/2 p-2 rounded-md top-2 w-full z-[11]">
          <div class="p-2 bg-red-500 rounded-lg">
            {errorMsg()}
          </div>
        </div>
        <div class="absolute left-0 top-0 bg-black opacity-40 w-full h-full z-10" onClick={()=>setErrorMsg(undefined)}/>
      </Show>

      <Show when={isFinished()}>
        <div class="p-2 overflow-y-auto overflow-x-hidden h-full">
          <div class="font-bold text-xl text-center pb-2 border-b border-gray-500 mb-3">Ringkasan Pesanan</div>
          <Show when={guitarBuilderCtx.getSelectedCategory() === 'electric'}>
            <div class="flex flex-col gap-3">
              <For each={R.entries.strict(guitarBuilderCtx.electricPrices())}>
                {([key, value]) => <ItemPrice label={GuitarBuilder.electricItemLabels[key]!} name={
                  (GuitarBuilder.mustImplementLabel as unknown as string[]).includes(key)
                    ? (()=>{
                      const selectedItem = guitarBuilderCtx.electric[key as typeof GuitarBuilder.mustImplementLabel[number]]?.get();
                      return selectedItem?.name.get() ?? "Tidak ada";
                    })()
                    //@ts-ignore
                    : GuitarBuilder.selectedElectricItemNames[key as keyof Omit<GuitarBuilder.SelectedItem['electric'], typeof GuitarBuilder.mustImplementLabel[number]>](guitarBuilderCtx.electric[key as keyof GuitarBuilder.SelectedItem['electric']].get()) ?? 'Tidak ada'
                } price={value} />}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={!isFinished()}>
        <div class="overflow-y-auto overflow-x-hidden h-full">
          <AssistantCtx.Provider value={
            {assistantStepsController, nextStepCandidate, assistantSocket, setOnNextButtonClick}
          }>
            <div class={"p-2 flex flex-col gap-2 " + (nextStepCandidate.get() ? 'mb-14' : '')}>
              {assistantStepsController.getCurrentStep()()}
            </div>
          </AssistantCtx.Provider>
        </div>
        <Show when={nextStepCandidate.get()}>
          <div class="absolute bottom-0 p-2 px-2 bg-gray-800 w-full z-[1] rounded-md">
            <Button class="w-full bg-blue-500 text-white !border-none" onClick={onNextButtonClick}>
              Lanjut
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  </div>
}

function ItemPrice(props : {
  label : string,
  name : string,
  price : number,
}){
  return <div>
  <div class="font-medium">{props.label}</div>
  <div class="flex justify-between">
    <div>{props.name}</div>
    <div class="relative grow">
      <div class="w-full absolute top-1/2 transform -translate-y-1/2 px-2">
        <div
          class="border-b border-dashed border-gray-400 "
        />
      </div>
    </div>
    <div>Rp. {priceFormat(props.price)}</div>  
  </div>
</div> 
}

export function useAssistant(){
  return useContext(AssistantCtx)!;
}
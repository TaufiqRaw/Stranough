import { IGuitarBuilder } from "~/pages/guitar-builder/utils/types";
import { ItemSelector } from "../../utils/item-selector";
import { JSX, Owner, Show, createEffect, createMemo, createResource, createSignal, on, onMount } from "solid-js";
import { Header } from "./header";
import { useAssistant } from "../_assistant";
import { assistantStepKeysType } from "../assistant-steps";
import { itemSelectorContainerCtx } from "../../utils/item-selector";
import { Caption } from "./caption";
import { AssistantSocket, GuitarBuilder } from "stranough-common";
import { Spinner } from "~/commons/components/spinner";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";

export function AssistantSelector( props : {
    nextStep ?: ()=>assistantStepKeysType,
    itemSelector : ()=>JSX.Element,
    title : string,
    children? : JSX.Element,
    guidance? : (ctx : IGuitarBuilder)=>JSX.Element,
    noRecommendation? : boolean,
    componentKey? : GuitarBuilder.SelectedItemKeys,
    onNextButtonClick? : ()=>(Promise<void> | void)
  }
){
  const {nextStepCandidate, assistantSocket, setOnNextButtonClick, cachedRecommendations} = useAssistant();
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const [selectedItem, setSelectedItem] = createSignal<{
    name : string,
    key : string | boolean,
  }>();

  const [recommendations] = createResource(async ()=>{
    if(props.noRecommendation) return undefined;
    if(!props.componentKey) return undefined;
    let selectedItem = guitarBuilderCtx.electric[props.componentKey as keyof GuitarBuilder.SelectedItem['electric']]?.get();

    if(cachedRecommendations.get()[props.componentKey] && selectedItem !== undefined){
      return cachedRecommendations.get()[props.componentKey];
    }
    const response = await assistantSocket.askRecommendation(props.componentKey);
    cachedRecommendations.set(p=>({
      ...p,
      [props.componentKey!] : response
    }));
    return response;
  })

  onMount(()=>{
    if(!props.componentKey)
      return;

    let selectedItem = guitarBuilderCtx.electric[props.componentKey as keyof GuitarBuilder.SelectedItem['electric']]?.get();
    if(selectedItem){
      const nextStep = props.nextStep ? props.nextStep() : undefined;
      if(props.nextStep){
        if(nextStep){
          nextStepCandidate.set(nextStep);
        }else{
          nextStepCandidate.set(undefined);
        }
      } else {
        nextStepCandidate.set('next');
      }
    }
  })

  setOnNextButtonClick(p=>async ()=>{
    if(props.onNextButtonClick){
      await props.onNextButtonClick();
    }else{
      //TODO : when no item selected set empty to socket and backend
      if(props.componentKey && selectedItem()){
        const res = await assistantSocket.selectItem(props.componentKey, selectedItem()!);
        if(!res)
          throw new Error('Failed to select item');
      }
    }
  })

  return <itemSelectorContainerCtx.Provider value={{
    onClick : (item, owner, ctx)=>{
      if(props.componentKey) assistantSocket.selectItem(props.componentKey, item ? {
        name : item.name,
        key : item.key + ""
      } : undefined);
      if(!item) setSelectedItem(undefined);
      else setSelectedItem({name : item!.name, key : item!.key + ""});
      
      const nextStep = props.nextStep ? props.nextStep() : undefined;
      if(props.nextStep){
        if(nextStep){
          nextStepCandidate.set(nextStep);
        }else{
          nextStepCandidate.set(undefined);
        }
      } else {
        nextStepCandidate.set('next');
      }
    },
    recommendationMsg : ()=>recommendations()?.message,
    recommendedItems : ()=>recommendations()?.recommendations,
  }}>
    <Header>
      {props.title}
    </Header>
    {props.children}
    {props.guidance ? <Caption type="info" class="relative">
      {props.guidance!(guitarBuilderCtx)}
    </Caption> : null}
    <Show 
      when={!props.noRecommendation}
      fallback={props.itemSelector()}
    >
      <Show when={recommendations()}
        fallback={<div class="h-full w-full grid items-center">
          <Spinner/>
        </div>}
      >
        {props.itemSelector()}
      </Show>
    </Show>
  </itemSelectorContainerCtx.Provider>
}
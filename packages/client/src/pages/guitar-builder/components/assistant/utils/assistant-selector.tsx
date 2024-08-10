import { IGuitarBuilder } from "~/pages/guitar-builder/utils/types";
import { ItemSelector } from "../../utils/item-selector";
import { JSX, Owner, createMemo, createResource, createSignal } from "solid-js";
import { Header } from "./header";
import { useAssistant } from "../_assistant";
import { assistantStepKeysType } from "../assistant-steps";
import { itemSelectorContainerCtx } from "../../utils/item-selector";
import { Caption } from "./caption";
import { AssistantSocket, GuitarBuilder } from "stranough-common";

export function AssistantSelector( props : {
    nextStep ?: ()=>assistantStepKeysType,
    itemSelector : ()=>JSX.Element,
    title : string,
    children? : JSX.Element,
    guidance? : ()=>JSX.Element,
    noRecommendation? : boolean,
    componentKey? : GuitarBuilder.SelectedItemKeys,
    onNextButtonClick? : ()=>(Promise<void> | void)
  }
){
  const {nextStepCandidate, assistantSocket, setOnNextButtonClick} = useAssistant();
  const [selectedItem, setSelectedItem] = createSignal<{
    name : string,
    key : string | boolean,
  }>();

  const [guidanceExpanded, setGuidanceExpanded] = createSignal(false);
  let guidanceContentRef;

  const [recommendations] = createResource(async ()=>{
    if(props.noRecommendation) return undefined;
    if(!props.componentKey) return undefined;
    return await assistantSocket.askRecommendation(props.componentKey);
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
    recommendedItems : ()=>recommendations()?.recommendations,
  }}>
    <Header>
      {props.title}
    </Header>
    {props.children}
    {props.guidance ? <Caption type="info" class="relative" onClick={()=>setGuidanceExpanded(p=>!p)}>
      <div class={ + 
        guidanceExpanded() ? '' : 'max-h-32 overflow-hidden'
      } ref={guidanceContentRef}>
        {props.guidance!()}
      </div>
      {!guidanceExpanded() ? <div class="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-gray-800 to-transparent"/> : null}
    </Caption> : null}
    {
      props.noRecommendation ? null : <Caption type="recommended">
        {recommendations() ? recommendations()?.message : 'Memuat...'}
      </Caption>
    }
    {
      props.itemSelector()
    }
  </itemSelectorContainerCtx.Provider>
}
import { JSX, createSignal } from "solid-js";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "../../utils/types";

export class AssistantStepsController {
  private context : IGuitarBuilder;
  private steps: ({
    component: () => JSX.Element;
    skip?: (ctx : IGuitarBuilder) => boolean;
  })[]
  private stepKeyIndex : {
    [key : string] : number
  } = {}
  private currentStepIndex = createSignalObject(0);

  constructor(
    ctx : IGuitarBuilder,
    steps : {
      key : string,
      component : ()=>JSX.Element,
      skip? : (ctx : IGuitarBuilder)=>boolean
    }[]
  ){
    this.context = ctx;
    this.steps = steps.map(step=>({
      component : step.component,
      skip : step.skip
    }));
    this.stepKeyIndex = steps.reduce((acc, step, index)=>{
      acc[step.key] = index;
      return acc;
    }, {} as typeof this.stepKeyIndex)
  }

  setSteps(stepKey : string){
    const index = this.stepKeyIndex[stepKey];
    if(index !== undefined){
      this.currentStepIndex.set(index);
    }else{
      console.error(`Step with key ${stepKey} not found`);
    }
  }

  next(){
    if(this.currentStepIndex.get() === this.steps.length-1){
      return 'finished';
    }
    const nextStep = this.steps[this.currentStepIndex.get()+1];
    this.currentStepIndex.set((x)=>x+1);
    if(nextStep.skip?.(this.context)){
      this.next();
    }
  }

  getCurrentStep(){
    return this.steps[this.currentStepIndex.get()].component;
  }
}
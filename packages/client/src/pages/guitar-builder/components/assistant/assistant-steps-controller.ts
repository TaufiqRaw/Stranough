import { JSX, createSignal } from "solid-js";
import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "../../utils/types";
import * as R from 'remeda';

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
  
  isNextFinished(){
    if(this.currentStepIndex.get() === this.steps.length-1){
      return true;
    }
    let nextStepIndex = this.currentStepIndex.get()+1;
    let nextStep = this.steps[nextStepIndex];
    while(nextStep.skip?.(this.context) && nextStepIndex < this.steps.length-1){
      nextStepIndex++;
      nextStep = this.steps[nextStepIndex];
    }
    if(this.steps[nextStepIndex].skip?.(this.context)){
      return true;
    }else{
      return false;
    }
  }

  next(){
    if(this.currentStepIndex.get() === this.steps.length-1){
      return 'finished';
    }
    let nextStepIndex = this.currentStepIndex.get()+1;
    let nextStep = this.steps[nextStepIndex];
    while(nextStep.skip?.(this.context) && nextStepIndex < this.steps.length-1){
      nextStepIndex++;
      nextStep = this.steps[nextStepIndex];
    }
    if(this.steps[nextStepIndex].skip?.(this.context)){
      return 'finished';
    }
    this.currentStepIndex.set(nextStepIndex);
  }

  getIndexByStepKey(stepKey : string){
    return this.stepKeyIndex[stepKey];
  }

  backable(){
    return this.currentStepIndex.get() > this.getIndexByStepKey('electric-model-type');
  }

  back(){
    if(this.currentStepIndex.get() > this.getIndexByStepKey('electric-model-type')){
      let backStepIndex = this.currentStepIndex.get()-1;
      let backStep = this.steps[backStepIndex];
      while(backStep.skip?.(this.context) && backStepIndex > 3){
        backStepIndex--;
        backStep = this.steps[backStepIndex];
      }
      this.currentStepIndex.set(backStepIndex);
    }
  }

  getCurrentStep(){
    return this.steps[this.currentStepIndex.get()].component;
  }

  getCurrentStepKey(){
    return R.keys(this.stepKeyIndex)[this.currentStepIndex.get()];
  }
}
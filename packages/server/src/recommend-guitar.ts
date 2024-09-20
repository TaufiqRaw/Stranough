import { AssistantService } from "./services/assistant.service";
import * as Constants from './constants';
import OpenAI from "openai";
import { GuitarBuilder } from "stranough-common";
import { SocketDI } from "./controllers/socket";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./database/mikro-orm.config";
import { AcousticGuitarModel, Bridge, ElectricGuitarModel, Headstock, Inlay, Jack, Knob, Media, Nut, Order, Peg, Pickguard, Pickup, Switch, User, Wood } from "./entities";
import {writeFile} from "fs/promises"

const prompt = "Saya ingin gitar dengan suara clean yang bagus untuk musik blues";
const iteration = 10;

const componentKeyFlow : GuitarBuilder.SelectedItemKeys[] = [
  "guitarModel", "bodyType", "stringCount", "constructionMethod", "topContour", "backContour", "bodyCoreWood","bodyTopWood","topBinding", 
  "backBinding", "topBodyColorType", "topBodyColor", "backBodyColorType", "backBodyColor", "burstType", "burstColor", "neckWood", "neckProfile", "trussRodType", "trussRodPosition", "neckColorType", "neckColor", "carbonFiberRod", "fingerboardWood", "sideInlay", "fingerboardRadius", "useFret", "inlay", "fretCount", "fingerboardEdge","headstock", "headstockOverlay", "peg", "nut", "bridge", 
  "bridge2", 
  "knob", "jack", "pickguardMaterial", "pickupConfiguration", 
  "bridgePickup", "middlePickup", "neckPickup"
];

require('dotenv').config({
  path : Constants.envPath
});

const assistantService = new AssistantService();

async function run(){

  const em = (await MikroORM.init(mikroOrmConfig)).em.fork()
  SocketDI.em = em;
  SocketDI.repository = {
    electricModels : em.getRepository(ElectricGuitarModel),
    acousticModels : em.getRepository(AcousticGuitarModel),
    medias : em.getRepository(Media),
    bridges : em.getRepository(Bridge),
    headstocks : em.getRepository(Headstock),
    jacks : em.getRepository(Jack),
    knobs : em.getRepository(Knob),
    nuts : em.getRepository(Nut),
    pegs : em.getRepository(Peg),
    pickguards : em.getRepository(Pickguard),
    switchs : em.getRepository(Switch),
    pickups : em.getRepository(Pickup),
    inlays : em.getRepository(Inlay),
    woods : em.getRepository(Wood),
    orders : em.getRepository(Order),
    users : em.getRepository(User),
  }

  const guitarResult : {
    [key in GuitarBuilder.SelectedItemKeys] ?: string[]
  }[] = Array.from({length : iteration}, ()=>({}));

  const socketId = "test";
  
  assistantService.create(socketId);

  try{
    await assistantService.uploadPref(socketId, prompt, undefined);
  }catch(e){
    console.error(e);
    process.exit(1);
  }

  for(let i = 0; i < iteration; i++){
    console.log(`NEW GUITAR, progress : ${i + 1}/${iteration}`);
    for(const componentKey of componentKeyFlow){
      console.log(`Asking recommendation for guitar #${i+1}, progress : ${componentKeyFlow.indexOf(componentKey) + 1}/${componentKeyFlow.length}`);
      try{
        const recommendation = await assistantService.askRecommendation(socketId, componentKey);
        const candidateName = recommendation.recommendationNames?.[0];
        const candidateKey = recommendation.recommendations[0];
        if(!candidateName || candidateName === "none" || !candidateKey){
          continue;
        }
        guitarResult[i][componentKey] = recommendation.recommendationNames;
        assistantService.select(socketId, componentKey, candidateName, candidateKey + "");
      }catch(e){
        console.warn(e);
        continue;
      }
    }
  }

  const guitarResultHighestFrequency : {
    [key in GuitarBuilder.SelectedItemKeys] ?: string
  } = {};

  for(const result of guitarResult){
    for(const key in result){
      if(!result[key as GuitarBuilder.SelectedItemKeys]){
        continue;
      }
      const values = result[key as GuitarBuilder.SelectedItemKeys]!;
      const value = values.reduce((acc, curr)=>{
        if(!acc[curr]){
          acc[curr] = 0;
        }
        acc[curr]++;
        return acc;
      }, {} as {[key : string] : number});
      const highestFrequency = Object.entries(value).reduce((acc, curr)=>{
        return acc[1] > curr[1] ? acc : curr;
      }, ["", 0]);
      guitarResultHighestFrequency[key as GuitarBuilder.SelectedItemKeys] = highestFrequency[0];
    }
  }

  // const highestFrequencyPercentageEachIteration : {
  //   [key in GuitarBuilder.SelectedItemKeys] ?: number[]
  // } = {};

  const highestFrequencySumEachIteration : {
    [key : string] : number[] | undefined
  } = {};
  
  for(let i = 0; i < iteration; i++){
    const resultTillIteration = guitarResult.slice(0, i + 1);
    for(const key in guitarResultHighestFrequency){
      if(!guitarResultHighestFrequency[key as GuitarBuilder.SelectedItemKeys]){
        continue;
      }
      const value = guitarResultHighestFrequency[key as GuitarBuilder.SelectedItemKeys]!;
      const frequency = resultTillIteration.reduce((acc, curr)=>{
        return curr[key as GuitarBuilder.SelectedItemKeys]?.reduce((acc, curr)=>{
          return curr === value ? acc + 1 : acc;
        }
        , acc) || 0;
      }, 0);
      const label = GuitarBuilder.selectedItemLabels[key as GuitarBuilder.SelectedItemKeys];
      if(highestFrequencySumEachIteration[label]){
        highestFrequencySumEachIteration[label]!.push(frequency);
      }else{
        highestFrequencySumEachIteration[label] = Array.from({length : i}, ()=>0).concat([frequency]);
      }
    }
  }

  const highestFrequencySumEachIterationLineObj = Object.entries(highestFrequencySumEachIteration).reduce((acc, [k,v])=>{
    if(!v){
      return acc;
    }
    if(acc[v.toString()]){
      acc[v.toString()].keys.push(k);
      return acc;
    }else{
      acc[v.toString()] = {
        keys : [k],
        value : v
      }
      return acc;
    }
  }, {} as {[key :string] : {
    keys : string[],
    value : number[]
  }})

  const highestFrequencySumEachIterationLine = Object.entries(highestFrequencySumEachIterationLineObj).reduce((acc, [k,v])=>{
    acc[v.keys.join(", ")] = v.value;
    return acc;
  }, {} as {
    [key : string] : number[]
  })

  const highestFrequencyPercentage = Object.entries(highestFrequencySumEachIteration).reduce((acc, [k,v])=>{
    if(!v){
      return acc;
    }
    const lastValue = v[v.length - 1];
    acc[k] = lastValue / iteration;
    return acc;
  }, {} as {[key : string] : number});

  console.log("Done");
  console.log(guitarResult);

  await writeFile("guitar-recommendation.json", JSON.stringify(guitarResult) + "\n\n" + "common per component : " + JSON.stringify(Object.entries(guitarResultHighestFrequency).reduce((acc, [k,v])=>{
    acc[GuitarBuilder.selectedItemLabels[k as GuitarBuilder.SelectedItemKeys]] = v;
    return acc;
  }, {} as {[k : string] : string})) + "\n\n" + "percentage of appearance : " + JSON.stringify(highestFrequencyPercentage) + 
  "\n\n" + "highest frequency sum each iter line : " + JSON.stringify(highestFrequencySumEachIterationLine), "utf-8");
  process.exit(0);
  
} 

run();
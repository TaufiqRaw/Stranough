import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder } from "./types";
import { Constants } from "~/constants";
import { ServerEntities } from "stranough-server";
import { ElectricModel, GuitarBuilder, GuitarBuilderCalc, Pickup as PickupConfig } from "stranough-common";
import { Accessor, createEffect, createMemo } from "solid-js";
import { SignalObject } from "~/commons/interfaces/signal-object";
import * as R from "remeda"
import { Position } from "~/commons/interfaces/position";

export function createGuitarComponent() : Omit<IGuitarBuilder, 'isBottomSideMenuSwiped' | 'socket'>{
  const constructionMethod = createSignalObject<typeof ElectricModel.constructionKeys[number] | undefined>();
  const contourTop = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'tummyContour'> | undefined | undefined>();
  const contourBack = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'forearmContour'> | undefined | undefined>();
  const pickupConfiguration = createSignalObject<keyof typeof PickupConfig.pickupConfigurations['electric-guitar']>();

  const preObj : {
    electric : {[key in keyof GuitarBuilder.SelectedItem['electric']] ?: SignalObject<GuitarBuilder.SelectedItem['electric'][key] | undefined>},
    acoustic : {[key in keyof GuitarBuilder.SelectedItem['acoustic']] ?: SignalObject<GuitarBuilder.SelectedItem['acoustic'][key] | undefined>},
  } = {
    electric : {
      fretCount : createSignalObject(),
      scaleLength : createSignalObject(), 
      stringCount : createSignalObject()
    },
    acoustic : {
      fretCount : createSignalObject(),
      scaleLength : createSignalObject(), 
      stringCount : createSignalObject()
    },
  }

  const obj : Omit<IGuitarBuilder, 'socket'> = {
    guitarType : createSignalObject('electric-guitar'),
    orientation : createSignalObject(),
    assembleGuitar : createSignalObject(),
    electricPrices : ()=>({} as {[k in keyof GuitarBuilder.SelectedItem['electric']] : number}),
    totalPrice : ()=>0,
    getSelectedCategory : ()=>obj.guitarType.get() ? GuitarBuilder.getGuitarCategory(obj.guitarType.get()!) : undefined,
    getSelectedCategoryObj : ()=>{
      switch(obj.guitarType.get()){
        case 'acoustic-bass':
        case 'acoustic-guitar':
          return obj.acoustic;
        case 'electric-bass':
        case 'electric-guitar':
          return obj.electric;
        default:
          return undefined;
      }
    },
    stringSpawnpoints : {
      headstock : Array.from({length : 12}, ()=>createSignalObject()),
      bridge : Array.from({length : 12}, ()=>createSignalObject()),
      nut : Array.from({length : 12}, ()=>createSignalObject()),
      tailpiece : Array.from({length : 12}, ()=>createSignalObject()),
      fromTop :()=>[],
    },
    electric : {
      guitarModel : createSignalObject(),
      bodyLogo : createSignalObject(),
      nut : createSignalObject(),
      headstockLogo : createSignalObject(),
      headstockOverlay : createSignalObject(),
      scaleLength : preObj.electric.scaleLength!,
      constructionMethod : {
        get : constructionMethod.get,
        set : (s : typeof ElectricModel.constructionKeys[number] | undefined)=>{
          obj.electric.guitarModel.get()?.selectedConstruction.set(s);
          constructionMethod.set(s);
        }
      },
      bodyType : createSignalObject(),
      bodyCoreWood : createSignalObject(),
      bodyTopWood : createSignalObject(),
      topBinding : createSignalObject(),
      backBinding : createSignalObject(),
      topBodyColor : createSignalObject(),
      topBodyColorType : createSignalObject(),
      backBodyColor : createSignalObject(),
      backBodyColorType : createSignalObject(),
      burstType : createSignalObject(),
      burstColor : createSignalObject(),

      trussRodPosition : createSignalObject(),
      trussRodType : createSignalObject(),
      neckBinding : createSignalObject(),
      neckColor : createSignalObject(),
      neckColorType : createSignalObject(),
      neckWood : createSignalObject(),
      neckProfile : createSignalObject(),
      carbonFiberRod : createSignalObject(),

      fingerboardWood : createSignalObject(),
      sideInlay : createSignalObject(),
      inlay : createSignalObject(),
      fingerboardRadius : createSignalObject(),
      useFret : createSignalObject(),
      fretCount : preObj.electric.fretCount!,
      // fingerboardScalloping : createSignalObject(),
      fingerboardEdge : createSignalObject(),
      
      stringCount : preObj.electric.stringCount!,
      headstock : createSignalObject(),
      headstockBinding : createSignalObject(),
      
      peg : createSignalObject(),
      bridge : createSignalObject(),
      bridge2 : createSignalObject(),
      jack : createSignalObject(),
      pickguardMaterial : createSignalObject(),
      knob : createSignalObject(),
      bridgePickup : createSignalObject(),
      neckPickup : createSignalObject(),
      middlePickup : createSignalObject(),
      pickupConfiguration : {
        get : pickupConfiguration.get,
        set : (s ?: keyof typeof PickupConfig.pickupConfigurations['electric-guitar'])=>{
          if(pickupConfiguration.get() && (obj?.electric.middlePickup.get() || obj?.electric.neckPickup.get() || obj?.electric.bridgePickup.get())){
            const conf = window.confirm('Apakah anda yakin ingin mengganti pickup configuration?, pickup yang telah dipilih akan direset');
            if(conf){
              obj?.electric.middlePickup.set(undefined);
              obj?.electric.neckPickup.set(undefined);
              obj?.electric.bridgePickup.set(undefined);
              pickupConfiguration.set(s);
            }
          }else{
            pickupConfiguration.set(s);
          }
        }
      },
      backContour : {
        get : contourBack.get,
        set : (s)=>{
          obj?.electric.guitarModel.get()?.selectedBackContour.set(s);
          contourBack.set(s);
        }
      },
      topContour : {
        get : contourTop.get,
        set : (s)=>{
          obj?.electric.guitarModel.get()?.selectedTopContour.set(s);
          contourTop.set(s);
        }
      },
      fretCountValue : createMemo(()=>GuitarBuilder.getValue(GuitarBuilder.fretCount, preObj.electric.fretCount!.get())),
      scaleLengthValue : createMemo(()=>GuitarBuilder.getValue({
        ...GuitarBuilder.scaleLengths["electric-guitar"],
        ...GuitarBuilder.scaleLengths["electric-bass"],
      }, preObj.electric.scaleLength!.get())),
      stringCountValue : createMemo(()=>GuitarBuilder.getValue({
        ...GuitarBuilder.stringCounts["electric-guitar"],
        ...GuitarBuilder.stringCounts["electric-bass"],
      }, preObj.electric.stringCount!.get())),
    },
    acoustic : {
      guitarModel : createSignalObject(),
      scaleLength : preObj.acoustic.scaleLength!,
      topBinding : createSignalObject(),
      backBinding : createSignalObject(),
      topBodyColor : createSignalObject(),
      topBodyColorType : createSignalObject(),
      backBodyColor : createSignalObject(),
      backBodyColorType : createSignalObject(),
      burstColor : createSignalObject(),
      burstType : createSignalObject(),
      
      neckProfile : createSignalObject(),
      trussRodPosition : createSignalObject(),
      carbonFiberRod : createSignalObject(),
      trussRodType : createSignalObject(),
      neckWood : createSignalObject(),
      neckBinding : createSignalObject(),
      neckColor : createSignalObject(),
      neckColorType : createSignalObject(),

      fingerboardWood : createSignalObject(),
      sideInlay : createSignalObject(),
      fingerboardRadius : createSignalObject(),
      stringCount : preObj.acoustic.stringCount!,
      useFret : createSignalObject(),
      fretCount : preObj.acoustic.fretCount!,
      // fingerboardScalloping : createSignalObject(),
      fingerboardEdge : createSignalObject(),
      
      headstock : createSignalObject(),
      headstockBinding : createSignalObject(),
      headstockOverlay : createSignalObject(),
      peg : createSignalObject(),
      nut : createSignalObject(),
      pickguardMaterial : createSignalObject(),
      fretCountValue : createMemo(()=>GuitarBuilder.getValue(GuitarBuilder.fretCount, preObj.acoustic.fretCount!.get())),
      scaleLengthValue : createMemo(()=>GuitarBuilder.getValue({
        ...GuitarBuilder.scaleLengths["acoustic-guitar"],
        ...GuitarBuilder.scaleLengths["acoustic-bass"],
      }, preObj.acoustic.scaleLength!.get())),
      stringCountValue : createMemo(()=>GuitarBuilder.getValue({
        ...GuitarBuilder.stringCounts["acoustic-guitar"],
        ...GuitarBuilder.stringCounts["acoustic-bass"],
      }, preObj.acoustic.stringCount!.get())),
    },
  };

  obj.stringSpawnpoints.fromTop = createMemo(()=>{
    const spawnpoints = [] as Position[][];
    for(let i = 0; i < 12; i++){
      const headstockSp = obj.stringSpawnpoints.headstock[i].get();
      const nutSp = obj.stringSpawnpoints.nut[i].get();
      const bridgeSp = obj.stringSpawnpoints.bridge[i].get();
      const tailpieceSp = obj.stringSpawnpoints.tailpiece[i].get();
      if(!headstockSp || !nutSp || !bridgeSp) continue;
      const oneString = [headstockSp, nutSp, bridgeSp, tailpieceSp].filter(sp=>sp) as Position[];
      spawnpoints.push(oneString);
    }
    return spawnpoints;
  });

  const electricPrices = createMemo<{[k in keyof GuitarBuilder.SelectedItem['electric']] : number}>(()=>{
    let acc = {} as {[k in keyof GuitarBuilder.SelectedItem['electric']] : number};
    R.pipe(
      R.entries.strict(R.omit(obj.electric, ['fretCountValue', 'scaleLengthValue', 'stringCountValue', ...GuitarBuilderCalc.mustImplementCalculationKeys])),
      R.forEach(([key, value])=>{
        if(value.get()){
          const item = GuitarBuilderCalc.selectedElectricCalculator[key](value.get() as never);
          acc = {...acc, [key] : item};
        }
      })
    )

    R.pipe(
      R.entries.strict(R.pick(obj.electric, GuitarBuilderCalc.mustImplementCalculationKeys)),
      R.forEach(([key, value])=>{
        if(key === 'pickguardMaterial'){
          const selectedPickguardType = obj.electric.guitarModel.get()?.selectedPickguard.get()?.type.get();
          if(selectedPickguardType){
            const selectedPickguardMaterial = obj.electric.pickguardMaterial.get();
            if(selectedPickguardMaterial){
              acc = {...acc, pickguardMaterial : GuitarBuilder.pickguardMaterials[selectedPickguardMaterial].price[selectedPickguardType]};
            }
          }
        }else if(value.get()){
          acc = {...acc, [key] : (value.get()?.price.get() ?? 0)};
        }
      })
    )
    return acc;

  })

  const totalPrice = createMemo(()=>{
    const category = obj.getSelectedCategory();
    if(!category) return 0;
    switch(category){
      case 'electric' : {
        let acc = 0;
        R.pipe(
          R.entries(electricPrices()),
          R.forEach(([key, value])=>{
            acc += value;
          })
        )
        
        return acc;
      }
      case 'acoustic' : {
        //TODO : implement acoustic price calculation
        return 0;
      }
    }
  })

  createEffect(()=>console.log("Headstock String SP",obj.stringSpawnpoints.headstock.map(s=>s.get())))
  createEffect(()=>console.log("Nut String SP",obj.stringSpawnpoints.nut.map(s=>s.get())))
  createEffect(()=>console.log("Bridge String SP",obj.stringSpawnpoints.bridge.map(s=>s.get())))
  createEffect(()=>console.log("Tailpiece String SP",obj.stringSpawnpoints.tailpiece.map(s=>s.get())))
  createEffect(()=>console.log("String Spawnpoints", obj.stringSpawnpoints.fromTop()))

  return {...obj, totalPrice, electricPrices};
}
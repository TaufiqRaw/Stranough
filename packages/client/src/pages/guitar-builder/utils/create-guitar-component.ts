import { createSignalObject } from "~/commons/functions/signal-object.util";
import { IGuitarBuilder, SelectedItemAsObj } from "./types";
import { Constants } from "~/constants";
import { ServerEntities } from "stranough-server";
import { ElectricModel, GuitarBuilder, GuitarBuilderCalc, Pickup as PickupConfig } from "stranough-common";
import { Accessor, createEffect, createMemo } from "solid-js";
import { SignalObject } from "~/commons/interfaces/signal-object";
import * as R from "remeda"
import { Position } from "~/commons/interfaces/position";

export function createGuitarComponent(props ?: SelectedItemAsObj) : Omit<IGuitarBuilder, 'socket'>{
  const constructionMethod = createSignalObject<typeof ElectricModel.constructionKeys[number] | undefined>(
    props?.electric.constructionMethod
  );
  const contourTop = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'tummyContour'> | undefined | undefined>(
    props?.electric.topContour
  );
  const contourBack = createSignalObject<Exclude<typeof ElectricModel.contourKeys[number], 'forearmContour'> | undefined | undefined>(
    props?.electric.backContour
  );
  const pickupConfiguration = createSignalObject<keyof typeof PickupConfig.pickupConfigurations['electric-guitar'] | undefined>(
    props?.electric.pickupConfiguration
  );

  const preObj : {
    electric : {[key in keyof GuitarBuilder.SelectedItem['electric']] ?: SignalObject<GuitarBuilder.SelectedItem['electric'][key] | undefined>},
    acoustic : {[key in keyof GuitarBuilder.SelectedItem['acoustic']] ?: SignalObject<GuitarBuilder.SelectedItem['acoustic'][key] | undefined>},
  } = {
    electric : {
      fretCount : createSignalObject(
        props?.electric.fretCount
      ),
      scaleLength : createSignalObject(
        props?.electric.scaleLength
      ), 
      stringCount : createSignalObject<GuitarBuilder.SelectedItem['electric']['stringCount'] | undefined>(
        props?.electric.stringCount
      ),
    },
    acoustic : {
      fretCount : createSignalObject(),
      scaleLength : createSignalObject(), 
      stringCount : createSignalObject()
    },
  }

  const obj : Omit<IGuitarBuilder, 'socket'> = {
    guitarType : createSignalObject('electric-guitar'),
    orientation : createSignalObject(
      props?.orientation
    ),
    assembleGuitar : createSignalObject(
      props?.assembleGuitar
    ),
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
      guitarModel : createSignalObject(
        props?.electric.guitarModel
      ),
      bodyLogo : createSignalObject(
        props?.electric.bodyLogo
      ),
      nut : createSignalObject(
        props?.electric.nut
      ),
      headstockLogo : createSignalObject(
        props?.electric.headstockLogo
      ),
      headstockOverlay : createSignalObject(
        props?.electric.headstockOverlay
      ),
      scaleLength : preObj.electric.scaleLength!,
      constructionMethod : {
        get : constructionMethod.get,
        set : (s : typeof ElectricModel.constructionKeys[number] | undefined)=>{
          obj.electric.guitarModel.get()?.selectedConstruction.set(s);
          constructionMethod.set(s);
        }
      },
      bodyType : createSignalObject(
        props?.electric.bodyType
      ),
      bodyCoreWood : createSignalObject(
        props?.electric.bodyCoreWood
      ),
      bodyTopWood : createSignalObject(
        props?.electric.bodyTopWood
      ),
      topBinding : createSignalObject(
        props?.electric.topBinding
      ),
      backBinding : createSignalObject(
        props?.electric.backBinding
      ),
      topBodyColor : createSignalObject(
        props?.electric.topBodyColor
      ),
      topBodyColorType : createSignalObject(
        props?.electric.topBodyColorType
      ),
      backBodyColor : createSignalObject(
        props?.electric.backBodyColor
      ),
      backBodyColorType : createSignalObject(
        props?.electric.backBodyColorType
      ),
      burstType : createSignalObject(
        props?.electric.burstType
      ),
      burstColor : createSignalObject(
        props?.electric.burstColor
      ),
      headstockColor : createSignalObject(
        props?.electric.headstockColor
      ),
      headstockColorType : createSignalObject(
        props?.electric.headstockColorType
      ),
      trussRodPosition : createSignalObject(
        props?.electric.trussRodPosition
      ),
      trussRodType : createSignalObject(
        props?.electric.trussRodType
      ),
      neckBinding : createSignalObject(
        props?.electric.neckBinding
      ),
      neckColor : createSignalObject(
        props?.electric.neckColor
      ),
      neckColorType : createSignalObject(
        props?.electric.neckColorType
      ),
      neckWood : createSignalObject(
        props?.electric.neckWood
      ),
      neckProfile : createSignalObject(
        props?.electric.neckProfile
      ),
      carbonFiberRod : createSignalObject(
        props?.electric.carbonFiberRod
      ),

      fingerboardWood : createSignalObject(
        props?.electric.fingerboardWood
      ),
      sideInlay : createSignalObject(
        props?.electric.sideInlay
      ),
      inlay : createSignalObject(
        props?.electric.inlay
      ),
      fingerboardRadius : createSignalObject(
        props?.electric.fingerboardRadius
      ),
      useFret : createSignalObject(
        props?.electric.useFret
      ),
      fretCount : preObj.electric.fretCount!,
      // fingerboardScalloping : createSignalObject(),
      fingerboardEdge : createSignalObject(
        props?.electric.fingerboardEdge
      ),
      
      stringCount : preObj.electric.stringCount!,
      headstock : createSignalObject(
        props?.electric.headstock
      ),
      headstockBinding : createSignalObject(
        props?.electric.headstockBinding
      ),
      
      peg : createSignalObject(
        props?.electric.peg
      ),
      bridge : createSignalObject(
        props?.electric.bridge
      ),
      bridge2 : createSignalObject(
        props?.electric.bridge2
      ),
      jack : createSignalObject(
        props?.electric.jack
      ),
      pickguard : createSignalObject(
        props?.electric.pickguard
      ),
      pickguardMaterial : createSignalObject(
        props?.electric.pickguardMaterial
      ),
      knob : createSignalObject(
        props?.electric.knob
      ),
      bridgePickup : createSignalObject(
        props?.electric.bridgePickup
      ),
      neckPickup : createSignalObject(
        props?.electric.neckPickup
      ),
      middlePickup : createSignalObject(
        props?.electric.middlePickup
      ),
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
          const selectedPickguardType = obj.electric.pickguard.get()?.type.get();
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

  return {...obj, totalPrice, electricPrices};
}
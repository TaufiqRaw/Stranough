import { Bridge, Colors, ElectricModel, GuitarBuilder, Pickup } from "stranough-common"
import { IUserChatContext } from "../interfaces/user-chat-context"
import { SocketDI } from "../controllers/socket"
import { findOneEntity } from "../utils/find-one-entity.util";
import * as R from 'remeda';

type ComponentItem = {
  [name : string] : {
    key : string | boolean | number;
    description ?: string;
    price ?: number;
  },
} & {
  nullable ?: boolean,
}
export const getComponentItems : {
  "electric-guitar" : {[key in keyof GuitarBuilder.SelectedItem['electric']] ?: (ctx : IUserChatContext)=>Promise<ComponentItem> | ComponentItem},
} = {
  "electric-guitar" : {
    async guitarModel(ctx) {
      const models = await SocketDI.repository.electricModels.findAll();
      return models.reduce((acc, model)=>{
        acc[model.name] = {
          key : model.id,
          description : model.description,
          price : model.price
        };
        return acc;
      }, {} as ComponentItem);
    },
    // backBinding(ctx){
    //   return GuitarBuilder.bindings.reduce((acc, binding)=>{
    //     acc[binding.name] = binding.key;
    //     return acc;
    //   }, {} as ComponentItem);
    // },
    backContour(ctx){
      return ElectricModel.backContourKeys.reduce((acc, contour)=>{
        acc[contour.replaceAll(/([A-Z])/g, " $1").toLowerCase()] = {
          key : contour,
          price : ElectricModel.backContourPrice[contour],
        }
        return acc;
      }, {} as ComponentItem);
    },
    topBodyColorType(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.bodyColorType).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    topBodyColor(ctx){
      const topBodyColorType = ctx.selectedComponent.electric.topBodyColorType;
      if(!topBodyColorType)
        throw new Error("Top body color type has not been selected");
      if(topBodyColorType === "natural")
        throw new Error("Natural color cant choose the color");
      return GuitarBuilder.asArray(GuitarBuilder.bodyColorTypeToColorsMap[topBodyColorType]).reduce((acc, color)=>{
        acc[color.name] = {
          key : color.key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    backBodyColorType(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.bodyColorType).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    backBodyColor(ctx){
      const backBodyColorType = ctx.selectedComponent.electric.backBodyColorType;
      if(!backBodyColorType)
        throw new Error("Back body color type has not been selected");
      if(backBodyColorType === "natural")
        throw new Error("Natural color cant choose the color");
      return GuitarBuilder.asArray(GuitarBuilder.bodyColorTypeToColorsMap[backBodyColorType]).reduce((acc, color)=>{
        acc[color.name] = {
          key : color.key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    headstockColorType(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.headstockColorType).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    headstockColor(ctx){
      const headstockColorType = ctx.selectedComponent.electric.headstockColorType;
      if(!headstockColorType)
        throw new Error("Headstock color type has not been selected");
      if(headstockColorType === "natural")
        throw new Error("Natural color cant choose the color");
      return GuitarBuilder.asArray(GuitarBuilder.headstockColorTypeToColorsMap[headstockColorType]).reduce((acc, color)=>{
        acc[color.name] = {
          key : color.key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    headstockOverlay(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.headstockOverlay).reduce((acc, overlay)=>{
        acc[overlay.name] = {
          key : overlay.key,
          price : overlay.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    async pickguardMaterial(ctx){
      const selectedModel = ctx.selectedComponent.electric.guitarModel;
      if(!selectedModel){
        throw new Error("Model has not been selected");
      }
      const model = await findOneEntity(SocketDI.repository.electricModels, selectedModel);
      if(!model){
        throw new Error("Model not found");
      }
      const pickguards = await model.pickguards?.loadItems();
      const pickguardType = pickguards ? pickguards[0]?.type ?? undefined : undefined;
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.pickguardMaterials).reduce((acc, material)=>{
        acc[material.name] = {
          key : material.key,
          price : material.price[pickguardType ?? "small"],
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    burstType(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.burstTypes).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    burstColor(ctx){
      return GuitarBuilder.asArray(Colors.burstColors).reduce((acc, color)=>{
        acc[color.name] = {
          key : color.key,
          price : (Colors.burstColors[color.key].value.length - 1) * 50000,
        }
        return acc;
      }, {} as ComponentItem);
    },

    bodyCoreWood(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.bodyCoreWoods).reduce((acc, w)=>{
        acc[w.name] = {
          key : w.key,
          price : w.price,
        }
        return acc;
      }, {} as ComponentItem)
    },
    bodyTopWood(ctx){
      const bodyType = ctx.selectedComponent.electric.bodyType;
      if(!bodyType)
        throw new Error("Body type has not been selected");

      return R.merge(GuitarBuilder.asArray(GuitarBuilder.bodyTopWoods).reduce((acc, wood)=>{
        acc[wood.name] = {
          key : wood.key,
          price : wood.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : bodyType === "solid"
      });
    },
    backBinding(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.bindings).reduce((acc, binding)=>{
        acc[binding.name] = {
          key : binding.key,
          price : binding.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    fingerboardEdge(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.fingerboardEdge).reduce((acc, binding)=>{
        acc[binding.name] = {
          key : binding.key,
          price : binding.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    fingerboardRadius(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.fingerboardRadius).reduce((acc, radius)=>{
        acc[radius.name] = {
          key : radius.key,
          price : radius.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    fingerboardWood(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.fingerboardWoods).reduce((acc, wood)=>{
        acc[wood.name] = {
          key : wood.key,
          price : wood.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    fretCount(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.fretCount).reduce((acc, count)=>{
        acc[count.name] = {
          key : count.key,
          price : count.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    bodyType(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.electricBodyTypes).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    constructionMethod(ctx){
      return ElectricModel.constructionKeys.reduce((acc, method)=>{
        acc[method.replaceAll(/([A-Z])/g, " $1").toLowerCase()] = {
          key : method,
          price : ElectricModel.constructionPrice[method],
        }
        return acc;
      }, {} as ComponentItem);
    },
    useFret(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.binaryOptions).reduce((acc, useFret)=>{
        acc[useFret.name] = {
          key : useFret.key === "yes",
          price : useFret.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    async headstock(ctx) {
      const selectedType = ctx.selectedComponent.guitarType as keyof typeof GuitarBuilder.stringCounts;
      if(!selectedType){
        throw new Error("Guitar type not found");
      }
      const selectedStringCount = ctx.selectedComponent[GuitarBuilder.getGuitarCategory(selectedType)].stringCount;
      if(!selectedStringCount){
        throw new Error("String count not found");
      }

      const stringCount = GuitarBuilder.getValue(GuitarBuilder.stringCounts[selectedType], selectedStringCount as any);

      const headstocks = await SocketDI.repository.headstocks.findAll({
        where : {
          stringCount : stringCount
        }
      });
      return headstocks.reduce((acc, headstock)=>{
        acc[headstock.name] = {
          key : headstock.id,
          price : headstock.price,
          description : headstock.description
        }
        return acc;
      }, {} as ComponentItem);
    },
    async bridgePickup(ctx){
      const pickupConfiguration = ctx.selectedComponent.electric.pickupConfiguration;
      if(!pickupConfiguration)
        throw new Error("Pickup configuration has not been selected");
      const pickupConfigurationValue = Pickup.pickupConfigurations["electric-guitar"][pickupConfiguration];
      if(!pickupConfigurationValue)
        throw new Error("Pickup configuration not found");
      let pickupType;
      switch(pickupConfigurationValue.length){
        case 1:
          pickupType = pickupConfigurationValue[0];
          break;
        case 2:
          pickupType = pickupConfigurationValue[1];
          break;
        case 3:
          pickupType = pickupConfigurationValue[2];
          break;
        default:
          throw new Error("Invalid pickup configuration value");
      }
      const pickups = await SocketDI.repository.pickups.findAll({
        where : {
          type : pickupType
        }
      });
      return pickups.reduce((acc, pickup)=>{
        acc[pickup.name] = {
          key : pickup.id,
          price : pickup.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    async neckPickup(ctx){
      const pickupConfiguration = ctx.selectedComponent.electric.pickupConfiguration;
      if(!pickupConfiguration)
        throw new Error("Pickup configuration has not been selected");
      const pickupConfigurationValue = Pickup.pickupConfigurations["electric-guitar"][pickupConfiguration];
      if(!pickupConfigurationValue)
        throw new Error("Pickup configuration not found");
      let pickupType;
      switch(pickupConfigurationValue.length){
        case 2:
          pickupType = pickupConfigurationValue[0];
          break;
        case 3:
          pickupType = pickupConfigurationValue[0];
          break;
        default:
          throw new Error("Invalid pickup configuration for neck pickup");
      }
      const pickups = await SocketDI.repository.pickups.findAll({
        where : {
          type : pickupType
        }
      });
      return pickups.reduce((acc, pickup)=>{
        acc[pickup.name] = {
          key : pickup.id,
          price : pickup.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    async middlePickup(ctx){
      const pickupConfiguration = ctx.selectedComponent.electric.pickupConfiguration;
      if(!pickupConfiguration)
        throw new Error("Pickup configuration has not been selected");
      const pickupConfigurationValue = Pickup.pickupConfigurations["electric-guitar"][pickupConfiguration];
      if(!pickupConfigurationValue)
        throw new Error("Pickup configuration not found");
      let pickupType;
      switch(pickupConfigurationValue.length){
        case 3:
          pickupType = pickupConfigurationValue[1];
          break;
        default:
          throw new Error("Invalid pickup configuration for middle pickup");
      }
      const pickups = await SocketDI.repository.pickups.findAll({
        where : {
          type : pickupType
        }
      });
      return pickups.reduce((acc, pickup)=>{
        acc[pickup.name] = {
          key : pickup.id,
          price : pickup.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    async nut(ctx) {
      const selectedStringCount = ctx.selectedComponent.electric.stringCount;
      if(!selectedStringCount)
        throw new Error("String count has not been selected");
      let stringCount = GuitarBuilder.getValue(GuitarBuilder.stringCounts["electric-guitar"], selectedStringCount as keyof typeof GuitarBuilder.stringCounts["electric-guitar"]);
      if(!stringCount)
        throw new Error("String count not found");

      const nuts = await SocketDI.repository.nuts.findAll({
        where : {stringCount}
      });
      return nuts.reduce((acc, nut)=>{
        acc[nut.name] = {
          key : nut.id,
          price : nut.price,
          description : nut.description
        }
        return acc;
      }, {} as ComponentItem);
    },
    neckColorType(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.bodyColorType).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    neckColor(ctx){
      const neckColorType = ctx.selectedComponent.electric.neckColorType;
      if(!neckColorType)
        throw new Error("Neck color type has not been selected");
      if(neckColorType === "natural")
        throw new Error("Natural color cant choose the color");
      return GuitarBuilder.asArray(GuitarBuilder.bodyColorTypeToColorsMap[neckColorType]).reduce((acc, color)=>{
        acc[color.name] = {
          key : color.key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    jack(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.jackTypes).reduce((acc, jack)=>{
        acc[jack.name] = {
          key : jack.key,
          price : jack.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    carbonFiberRod(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.binaryOptions).reduce((acc, carbonFiberRod)=>{
        acc[carbonFiberRod.name] = {
          key : carbonFiberRod.key === "yes",
          price : carbonFiberRod.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    trussRodPosition(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.trussRodPositions['electric']).reduce((acc, position)=>{
        acc[position.name] = {
          key : position.key,
          price : position.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    trussRodType(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.TrussRodType).reduce((acc, type)=>{
        acc[type.name] = {
          key : type.key,
          price : type.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    // async jack(ctx) {
    //   const jacks = await SocketDI.repository.jacks.findAll();
    //   return jacks.reduce((acc, jack)=>{
    //     acc[jack.name] = jack.id + '';
    //     return acc;
    //   }, {} as ComponentItem);
    // },
    async knob(ctx) {
      const knobs = await SocketDI.repository.knobs.findAll();
      return knobs.reduce((acc, knob)=>{
        acc[knob.name] = {
          key : knob.id,
          price : knob.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    neckBinding(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.bindings).reduce((acc, binding)=>{
        acc[binding.name] = {
          key : binding.key,
          price : binding.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    neckProfile(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.neckProfiles).reduce((acc, profile)=>{
        acc[profile.name] = {
          key : profile.key,
          price : profile.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    neckWood(ctx){
      return GuitarBuilder.asArray(GuitarBuilder.neckWoods).reduce((acc, wood)=>{
        acc[wood.name] = {
          key : wood.key,
          price : wood.price,
        }
        return acc;
      }, {} as ComponentItem);
    },
    scaleLength(ctx){
      const selectedType = ctx.selectedComponent.guitarType as keyof typeof GuitarBuilder.guitarTypes;
      if(!selectedType){
        throw new Error("Guitar type not found");
      }
      return GuitarBuilder.asArray(GuitarBuilder.scaleLengths[selectedType]).reduce((acc, length)=>{
        acc[length.name] = {
          key : length.key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    topBinding(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.bindings).reduce((acc, binding)=>{
        acc[binding.name] = {
          key : binding.key,
          price : binding.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    inlay(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.inlayTypes).reduce((acc, inlay)=>{
        acc[inlay.name] = {
          key : inlay.key,
          price : inlay.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    sideInlay(ctx){
      return R.merge(GuitarBuilder.asArray(GuitarBuilder.sideInlay).reduce((acc, inlay)=>{
        acc[inlay.name] = {
          key : inlay.key,
          price : inlay.price,
        }
        return acc;
      }, {} as ComponentItem), {
        nullable : true
      });
    },
    async peg(ctx) {
      const selectedType = ctx.selectedComponent.guitarType;
      if(!selectedType){
        throw new Error("Guitar type not found");
      }
      const headstockId = ctx.selectedComponent[GuitarBuilder.getGuitarCategory(selectedType)].headstock;
      if(!headstockId){
        throw new Error("Headstock type not found");
      }
      const headstock = await findOneEntity(SocketDI.repository.headstocks, headstockId);
      if(!headstock){
        throw new Error("Headstock not found");
      }
      const isSlotted = headstock.isSlotted;

      const pegs = await SocketDI.repository.pegs.findAll({
        where : {
          forSlottedHeadstock : isSlotted,
        }
      });
      return pegs.reduce((acc, peg)=>{
        acc[peg.name] = {
          key : peg.id,
          price : peg.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    pickupConfiguration(ctx){
      return Object.entries(Pickup.pickupConfigurations["electric-guitar"]).reduce((acc, [key, value])=>{
        //TODO: name should be the full name of the pickup configuration instead of H-H or H-S-S
        acc[key] = {
          key : key,
        }
        return acc;
      }, {} as ComponentItem);
    },
    stringCount(ctx) {
      return GuitarBuilder.asArray(GuitarBuilder.stringCounts["electric-guitar"]).reduce((acc, count)=>{
        acc[count.name] = {
          key : count.key,
          price : count.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    async bridge(ctx){
      let selectedStringCount = ctx.selectedComponent.electric.stringCount;
      if(!selectedStringCount)
        throw new Error("String count has not been selected");
      let stringCount = GuitarBuilder.getValue(GuitarBuilder.stringCounts["electric-guitar"], selectedStringCount as keyof typeof GuitarBuilder.stringCounts["electric-guitar"]);
      if(!stringCount)
        throw new Error("String count not found");
      
      const bridges = await SocketDI.repository.bridges.findAll({
        where : {
          stringCount : {
            $in : [1, stringCount]
          }
          // stringCount !== 12  
          //     ? {
          //         $in : [1, stringCount]
          //       } 
          //     : stringCount
        }
      });

      return bridges.reduce((acc, bridge)=>{
        acc[bridge.name] = {
          key : bridge.id,
          price : bridge.price
        }
        return acc;
      }, {} as ComponentItem);
    },
    async bridge2(ctx){
      const bridge1id = ctx.selectedComponent.electric.bridge;
      if(!bridge1id)
        throw new Error("First bridge has not been selected");
      const bridge1 = await findOneEntity(SocketDI.repository.bridges, bridge1id);
      if(!bridge1)
        throw new Error("First bridge not found");
      const bridge1type = bridge1.type;
      if(![Bridge.BridgeType.Tailpiece, Bridge.BridgeType.NearTailpiece, Bridge.BridgeType.Tuneomatic].includes(bridge1type)){
        throw new Error("Invalid first bridge type");
      }
      
      //first bridge either tailpiece or tuneomatic, if not this selector should be disabled or skipped
      const isTailpiece = [Bridge.BridgeType.Tailpiece, Bridge.BridgeType.NearTailpiece].includes(bridge1type);
      const bridges = await SocketDI.repository.bridges.findAll({
        where : {
          type : isTailpiece ? Bridge.BridgeType.Tuneomatic : {
            $in : [Bridge.BridgeType.Tailpiece, Bridge.BridgeType.NearTailpiece]
          },
          stringCount : bridge1.stringCount
        }
      });
      return bridges.reduce((acc, bridge)=>{
        acc[bridge.name] = {
          key : bridge.id,
          price : bridge.price,
          description : bridge.description
        }
        return acc;
      }, {} as ComponentItem);
    },

    
    
    topContour(ctx) {
      return ElectricModel.topContourKeys.reduce((acc, contour)=>{
        acc[contour.replaceAll(/([A-Z])/g, " $1").toLowerCase()] = {
          key : contour,
          price : ElectricModel.topContourPrice[contour],
        }
        return acc;
      }, {} as ComponentItem);
    },
  }
}
export const componentName : {
  [key in GuitarBuilder.SelectedItemKeys] ?: string;
} = {
  guitarModel : "Basic Shape"
}

export const additionalComponentInfo : {
  [key in GuitarBuilder.SelectedItemKeys] ?: string;
} = {
  guitarModel : "The basic shape of the guitar, its only dictate guitar basic shape, doesnt dictate whether its hollow or solid because all basic shape can be hollow or solid in this custom guitar, all basic shape also can be headless or not",
  stringCount : "The number of strings on the guitar, the standard are 6 string for guitar and 4 string for bass.",
  pickupConfiguration : "The configuration of the pickups, H-H means two humbuckers, H-S-S means one humbucker and two single coils",
  bodyTopWood : "The wood that is used for the top of the body, its optional if the body type is solid. when in solid guitar it just used for the cosmetic purpose so its better to use none or make the user freely choose or use laminated wood instead of solid ones. laminated means the wood is not fully solid, its a thin layer of wood that is glued to the top of the body, this means that the laminated wood doesnt affect guitar tone, while solid means the wood is fully solid and will affect the guitar tone",
  jack : "The type of jack, top is the jack that is placed on the top of the guitar, making the cable goes up, top plated is the jack that is placed on the top of the guitar but with a angled plate making the cable goes 45 degree, side is the jack that is placed on the side of the guitar, making the cable goes to the side",
  neckColorType : "The color type of the neck, natural means the neck is not painted, while the other color type means the neck is painted",
  topBodyColorType : "The color type of the top of the body only, natural means the top body is not painted, while the other color type means the top body is painted",
  backBodyColorType : "The color type of the back of the body and side of the body, natural means the back body and side body is not painted, while the other color type means the back body and side body is painted",
  useFret : "Whether the fret is used or not, if its no, the fretboard will be fretless, if it yes, the fretboard will have frets",
  headstockColorType : "The color type of the headstock, natural means the headstock is not painted, while the other color type means the headstock is painted",
  headstockOverlay : "The overlay of the headstock, the overlay is the thin layer of some material that is glued to the headstock, this is purely cosmetic",
}
import { Colors, GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { SelectorRequireComponent } from "./_selector-require-component";
import * as R from "remeda";
import { Constants } from "~/constants";

export const BodyColorSelector = (props :{
  type : 'top' | 'back'
})=><SelectorRequireComponent
  requires={[{
    message : "Pilih jenis warna terlebih dahulu",
    test : (ctx)=>ctx.getSelectedCategoryObj()?.[`${props.type}BodyColorType`].get() !== undefined
  }]}
>
{ (ctx)=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bodyColorTypeToColorsMap[ctx.getSelectedCategoryObj()![`${props.type}BodyColorType`].get()!]).map(i=>{
    let thumbnail : string = '';
    switch(ctx.getSelectedCategoryObj()![`${props.type}BodyColorType`].get()){
      case 'transparent' :
      case 'solid' 
        : thumbnail = GuitarBuilder.getValue(Colors.solidColors, i.key as keyof typeof Colors.solidColors)!.toString(16).padStart(6, '0'); 
        break;
      case 'metallic' : 
      thumbnail = Constants.metallicColorUrl[i.key as keyof typeof Colors.metallicColors]; 
      break;
    }
    return {
    ...i,
    ...(ctx.getSelectedCategoryObj()![`${props.type}BodyColorType`].get() === 'metallic' ? {
      thumbnailSrc : thumbnail
    } : {
      imgBtnChild : ()=><div
        class="w-full h-full"
        style={{"background-color" : `#${thumbnail}`}}
      />
    })
  }})}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.[`${props.type}BodyColor`].set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.[`${props.type}BodyColor`].get()}
  type="image"
/>}
</SelectorRequireComponent>

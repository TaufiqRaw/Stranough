import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { SelectorRequireComponent } from "./_selector-require-component";
import { onCleanup } from "solid-js";

// const trussRodTypeThumbs : {[key in typeof GuitarBuilder.TrussRodType[number]['key']] : string} = {
//   "2-way-action" : "/assets/gui/truss-rod-type/2-way-action.png",
//   "double-truss-rod" : "/assets/gui/truss-rod-type/double-truss-rod.png",
// }

export const TrussRodTypeSelector = () => <SelectorRequireComponent
  requires={[{
    message : "Pilih bentuk dasar gitar terlebih dahulu",
    test : (ctx)=>ctx?.getSelectedCategoryObj()?.guitarModel.get() !== undefined
  }]}
>
  {(ctx)=><ItemSelector
  items={()=>{
    const items = GuitarBuilder.asArray(GuitarBuilder.TrussRodType);
    onCleanup(()=>ctx?.clearExplanation());
    return ()=>items;
  }}
  onClick={async(i, o, _)=>{
    ctx?.getSelectedCategoryObj()?.trussRodType.set(i.key);
    switch(i.key){
      case 'double-action' : {
        ctx?.setExplanation({
          message : "Truss rod double action adalah truss rod yang bisa diatur ke dua arah, baik untuk melonggarkan maupun mengencangkan.",
          imageSrc : ["/assets/videos/truss-rod/loosen.gif", "/assets/videos/truss-rod/tighten.gif"]
        })
        break;
      }
      case 'single-action' : {
        ctx?.setExplanation({
          message : "Truss rod single action adalah truss rod yang hanya bisa diatur ke satu arah, hanya untuk melonggarkan.",
          imageSrc : ["/assets/videos/truss-rod/loosen.gif"]
        })
        break;
      }
    }
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.trussRodType.get();
  }}
  type="text"
/>}
  </SelectorRequireComponent>
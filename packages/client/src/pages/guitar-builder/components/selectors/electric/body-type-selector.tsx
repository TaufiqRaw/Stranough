import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { Constants } from "~/constants";
import { SelectorRequireComponent } from "../_selector-require-component";
import { onCleanup } from "solid-js";

const bodyTypeImages : {[k in keyof typeof GuitarBuilder.electricBodyTypes] : string} = {
  "semi-hollow" : "/assets/gui/body-types/semi-hollow.jpg",
  "solid" : "/assets/gui/body-types/solid.jpg",
  "hollow" : "/assets/gui/body-types/hollow.jpg",
  chambered : "/assets/gui/body-types/chambered.jpg",
}

export const bodyTypeSelector = () =><SelectorRequireComponent requires={[{
  message : "pilih bentuk dasar terlebih dahulu",
  test : (ctx)=>ctx.electric.guitarModel.get() !== undefined
}]}>
  {(ctx)=> <ItemSelector
  items={()=>{
    const items = GuitarBuilder.asArray(GuitarBuilder.electricBodyTypes).map(i=>({
      ...i,
      thumbnailSrc : bodyTypeImages[i.key],
    }));
    onCleanup(()=>ctx?.clearExplanation());
    return ()=>items;
  }}
  onClick={(i, o, _)=>{
    ctx?.electric.bodyType.set(i.key);
    switch(i.key){
      case 'semi-hollow' : {
        ctx?.setExplanation({
          message : "Semi-hollow adalah jenis body gitar yang memiliki ruang kosong di dalamnya.",
          videoSrc : ["/assets/videos/body-type/semi-hollow.mp4"],
        })
        break;
      }
      case 'chambered' : {
        ctx?.setExplanation({
          message : "Chambered adalah jenis body gitar yang tampak seperti solid, tetapi memiliki kantong udara kecil yang tersembunyi di dalamnya, yang bertujuan untuk mengurangi berat gitar.",
          videoSrc : ["/assets/videos/body-type/chambered.mp4"],
        })
        break;
      }
      case 'solid' : {
        ctx?.setExplanation({
          message : "Solid terbuat dari satu kayu utuh.",
          videoSrc : ["/assets/videos/body-type/solid.mp4"],
        })
        break;
      }
      case 'hollow' : {
        ctx?.setExplanation({
          message : "Hollow adalah jenis body gitar yang memiliki ruang kosong di dalamnya.",
          videoSrc : ["/assets/videos/body-type/hollow.mp4"],
        })
        break;
      }
    }
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.bodyType.get()
  }}
  type="image"
/>}
</SelectorRequireComponent>
import { ElectricModel } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { onCleanup } from "solid-js";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { SelectorRequireComponent } from "../_selector-require-component";

const constructionMethodImages : {[k in typeof ElectricModel.constructionKeys[number]] : string} = {
  boltOnConstruction : "/assets/gui/bolt-on.png",
  setInConstruction : "/assets/gui/set-neck.png",
  neckThroughConstruction : "/assets/gui/neck-through.png",
}

export const constructionMethodLabels : {[k in typeof ElectricModel.constructionKeys[number]] : string} = {
  boltOnConstruction : "Bolt-on",
  setInConstruction : "Set Neck",
  neckThroughConstruction : "Neck Through",
}

export const ConstructionMethodSelector = () => <SelectorRequireComponent requires={[{
  message : "pilih bentuk dasar terlebih dahulu",
  test : (ctx)=>ctx.electric.guitarModel.get() !== undefined
}]}>
  {(ctx)=><ItemSelector items={
  ()=>{
    const items = ElectricModel.constructionKeys.map(k=>({
      key : k,
      name : constructionMethodLabels[k],
      thumbnailSrc : constructionMethodImages[k],
      price : ElectricModel.constructionPrice[k],
    }));
    onCleanup(()=>ctx?.clearExplanation());
    return ()=>items;
  }}
  onClick={async(i, o, _)=>{
      ctx?.electric.constructionMethod.set(i.key);
      switch(i.key){
        case 'boltOnConstruction' : {
          ctx?.setExplanation({
            message : "Bolt-on adalah teknik konstruksi gitar dimana neck di pasang ke body dengan baut.",
            videoSrc : ["/assets/videos/construction/bolt-on.mp4"],
          })
          break;
        }
        case 'setInConstruction' : {
          ctx?.setExplanation({
            message : "Set Neck adalah teknik konstruksi gitar dimana neck di pasang ke body dengan lem.",
            videoSrc : ["/assets/videos/construction/set-neck.mp4"],
          })
          break;
        }
        case 'neckThroughConstruction' : {
          ctx?.setExplanation({
            message : "Neck Through adalah teknik konstruksi gitar dimana neck adalah bagian dari body.",
            videoSrc : ["/assets/videos/construction/neck-through.mp4"],
          })
          break;
        }
      }
  }}
  selected={(i, _)=>{
    return i.key === ctx?.electric.constructionMethod.get()
  }}
  type="image"
/>}
  </SelectorRequireComponent>
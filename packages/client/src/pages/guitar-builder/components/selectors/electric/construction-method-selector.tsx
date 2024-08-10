import { ElectricModel } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

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

export const ConstructionMethodSelector = () => <ItemSelector items={
  ()=>()=>ElectricModel.constructionKeys.map(k=>({
    key : k,
    name : constructionMethodLabels[k],
    thumbnailSrc : constructionMethodImages[k],
    price : ElectricModel.constructionPrice[k],
  }))}
  onClick={async(i, o, ctx)=>{
      ctx?.electric.constructionMethod.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.constructionMethod.get()
  }}
  type="image"
/>
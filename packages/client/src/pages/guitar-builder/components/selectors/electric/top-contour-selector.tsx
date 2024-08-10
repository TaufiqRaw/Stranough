import { ElectricModel } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

const topContourImages : {[k in typeof ElectricModel.topContourKeys[number]] : string} = {
  carvedContour : "/assets/gui/top-carved-contour.png",
  flatContour : "/assets/gui/top-flat-contour.png",
  forearmContour : "/assets/gui/top-forearm-contour.png",
}

const topContourLabels : {[k in typeof ElectricModel.topContourKeys[number]] : string} = {
  carvedContour : "Carved",
  flatContour : "Flat",
  forearmContour : "Forearm",
}

export const TopContourSelector = () => <ItemSelector
  items={()=>()=>ElectricModel.topContourKeys.map(k=>({
    key : k,
    name : topContourLabels[k],
    thumbnailSrc : topContourImages[k],
    price : ElectricModel.topContourPrice[k],
  }))}
  onClick={async(i, o, ctx)=>{
      ctx?.electric.topContour.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.topContour.get()
  }}
  type="image"
/>
import { ElectricModel } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

const backContourLabels : {[k in typeof ElectricModel.backContourKeys[number]] : string} = {
  carvedContour : "Carved",
  flatContour : "Flat",
  tummyContour : "Tummy",
}

const backContourImages : {[k in typeof ElectricModel.backContourKeys[number]] : string} = {
  carvedContour : "/assets/gui/back-carved-contour.png",
  flatContour : "/assets/gui/back-flat-contour.png",
  tummyContour : "/assets/gui/back-tummy-contour.png",
}

export const BackContourSelector = () => <ItemSelector
  items={()=>()=>ElectricModel.backContourKeys.map(k=>({
    key : k,
    name : backContourLabels[k],
    thumbnailSrc : backContourImages[k],
    price : ElectricModel.backContourPrice[k],
  }))}
  onClick={async(i, o, ctx)=>{
    ctx?.electric.backContour.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.backContour.get()
  }}
  type="image"
/>
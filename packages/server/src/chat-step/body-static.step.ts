import { staticStepFactory } from "./static-step-factory";

export const bodyCoreWoodList = Object.freeze(
  ["mahogany","hard-maple","walnut","alder","swamp Ash","rosewood", "korina-white", "korina-black"] as const);

export const bodyTopWoodList = Object.freeze(
  ["none", "laminated-rosewood", "laminated-plain-maple","laminated-walnut","laminated-flamed-maple","laminated-quilted-maple","laminated-burl","solid-mahogany","solid-swamp-ash","solid-alder","solid-hard-maple","solid-walnut","solid-rosewood","solid-flamed-maple","solid-quilted-maple","solid-korina"] as const);

export const bodyBindingList = Object.freeze(["none","1-ply-pvc","3-ply-pvc","5-ply-pvc","7-ply-pvc","pearloid","synthetic-abalone","wood-purfling","herringbone-purfling","mother-of-pearl","abalone"] as const);

export const bodyColorTypeList = Object.freeze(
  ["natural-transparent","solid","relic","top-burst","top-back-burst","metallic","sparkle","stripes","swirl"] as const
)

export const bodyFinishList = Object.freeze(
  ['satin', 'gloss'] as const
);

export const BodyCoreWoodStep = staticStepFactory(
  bodyCoreWoodList, 
  "Pilih jenis kayu yang kamu inginkan untuk bagian tubuh gitar"
); 

export const BodyTopWoodStep = staticStepFactory(bodyTopWoodList,
  "Pilih jenis kayu yang kamu inginkan untuk bagian atas gitar"
);

export const BodyBackBindingStep = staticStepFactory(
  bodyBindingList, 
  "Pilih jenis binding yang kamu inginkan untuk bagian bawah gitar"
);

export const BodyTopBindingStep = staticStepFactory(
  bodyBindingList, 
  "Pilih jenis binding yang kamu inginkan untuk bagian atas gitar"
);

export const BodyColorTypeStep = staticStepFactory(
  bodyColorTypeList,
  "Pilih jenis warna yang kamu inginkan",
  (ctx, selected)=>{
    ctx.selected.colorType = bodyColorTypeList[selected];
  }
);

export const BodyFinishStep = staticStepFactory(
  bodyFinishList,
  "Pilih jenis finishing yang kamu inginkan"
);

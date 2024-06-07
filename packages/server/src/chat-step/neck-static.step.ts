import { staticStepFactory } from "./static-step-factory";

export const neckWoodList = Object.freeze(
  ["same-with-body","mahogany","maple","walnut","rosewood","quartersawn-maple","roasted-maple","ebony","flamed-maple","bird-eyes-maple","quilted-maple","multi-piece-mahogany-walnut-rosewood","multi-piece-maple-mahogany","multi-piece-maple-walnut-rosewood","multi-piece-mahogany-maple-walnut-rosewood"] as const);

export const NeckWoodStep = staticStepFactory(
  neckWoodList, 
  "Pilih jenis kayu yang kamu inginkan untuk bagian neck gitar",
  undefined,
  (ctx)=>{
    return ctx.selected.constructionMethod === "neckThroughBody";
  }
);
  
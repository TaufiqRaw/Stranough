import { DOMAdapter, Texture } from "pixi.js";

export function generateAcousticMask(maskLeft : HTMLImageElement, maskRight : HTMLImageElement, options : {
  flipRight ?: boolean,
}){
  const canvas = DOMAdapter.get().createCanvas(maskLeft.width + maskRight.width, Math.max(maskLeft.height, maskRight.height));
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(options.flipRight){
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(maskRight, -canvas.width, 0);
    ctx.restore();
    ctx.drawImage(maskLeft, 2, 0);
  }else{
    ctx.drawImage(maskLeft, 0, 0);
    ctx.drawImage(maskRight, maskLeft.width-2, 0);
  }
    
  return Texture.from(canvas);
}
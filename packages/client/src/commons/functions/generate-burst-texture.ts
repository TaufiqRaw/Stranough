import { DOMAdapter, Texture } from "pixi.js";
import { Position } from "../interfaces/position";

export function generateBurstTexture(mask : HTMLImageElement, maskBorder : Position[], options : {
  gradientLength : number,
  baseLength : number,
}){
  const canvas = DOMAdapter.get().createCanvas(mask.width, mask.height);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = "rgba(255, 255, 255, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw border
  const path = new Path2D();
  maskBorder.forEach((p, i)=>{
    if(i === 0) path.moveTo(p.x, p.y);
    else path.lineTo(p.x, p.y);
  });
  path.closePath();

  const alphaReduction = 20/options.gradientLength;

  const step = options.gradientLength / 20;
  
  for(let borderWidth = options.gradientLength; borderWidth > 0; borderWidth -= step){
    ctx.lineWidth = borderWidth + options.baseLength;
    const x = 1-(borderWidth / options.gradientLength);
    const alpha = Math.pow(x, 2);
    ctx.strokeStyle = `rgba(255,255,255,${borderWidth === 1 ? 1 : (alpha * alphaReduction)})`;
    ctx.stroke(path);
  }

  
  
  return Texture.from(canvas);
}
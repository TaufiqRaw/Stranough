import { Assets, Texture } from "pixi.js";
import { Accessor, createEffect, createMemo, createResource, on } from "solid-js";
import { serverImgUrl } from "./server-img-url.util";

export function createPixiTexture(_url : ()=>string | undefined, serverImg : boolean = true){
  const url = ()=>serverImg ? serverImgUrl(_url()) : _url();
  const [res, {refetch}] = createResource(async ()=>{
    const u = url();
    if(!u) return undefined;
    await Assets.backgroundLoad(u);
    return await Assets.load(u) as Texture;
  })
  createEffect(on(url,()=>{
    refetch();
  }))
  return res;
}
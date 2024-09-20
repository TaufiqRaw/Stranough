import { Assets, Texture } from "pixi.js";
import { Accessor, createEffect, createMemo, createResource, on, onCleanup, onMount } from "solid-js";
import { serverImgUrl } from "./server-img-url.util";
import { usePixiLoadedAssetCounter } from "../contexts/pixi-loaded-asset-counter.context";

export function createPixiTexture(_url : ()=>string | undefined, serverImg : boolean = true, overrideCleanup?: boolean){
  const assetCounterCtx = usePixiLoadedAssetCounter();
  const url = createMemo(()=>serverImg ? serverImgUrl(_url()) : _url())
  
  const [res, {refetch}] = createResource(async ()=>{
    const u = url();
    if(!u) return undefined;
    await Assets.backgroundLoad(u);
    return await Assets.load(u) as Texture;
  })

  createEffect(on(url,(val, prev)=>{
    refetch();
  }))
  return res;
}
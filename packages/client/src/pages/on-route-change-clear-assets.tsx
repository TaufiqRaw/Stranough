import { useLocation } from "@solidjs/router";
import { Assets } from "pixi.js";
import { JSX, createEffect } from "solid-js";

export function OnRouteChangeClearAssets(props : {children ?: JSX.Element}){
  const location = useLocation();
  createEffect(()=>{
    location.state;
    location.pathname;
    Assets.cache.reset();
    console.log('cleared assets');
  })

  return props.children;
}
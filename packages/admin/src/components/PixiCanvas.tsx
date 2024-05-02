import { Application, Color, Graphics } from "pixi.js";
import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import { extensions } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import Viewport from "~/utils/classes/Viewport";
import { waitForElementRender } from "~/utils/functions/waitForElementRender";

extensions.add(InteractionManager);

export interface PixiCanvasOnLoadedItem {
  app: Application;
  viewport: Viewport;
}

export default function PixiCanvas(props: {
  onLoaded: (item: PixiCanvasOnLoadedItem) => void;
  width?: number;
  height?: number;
  ref?: HTMLDivElement;
  resizeTo?: HTMLElement | "container";
  class ?: string;
}) {
  const app = new Application();
  let canvasContainer: HTMLDivElement | undefined;
  onMount(() => {
    waitForElementRender(canvasContainer!, (el) => {
      app
      .init({
        background: "#E4E4E4",
        resizeTo: props.resizeTo
          ? props.resizeTo == "container"
            ? el
            : props.resizeTo
          : window,
        width:
          props.resizeTo == "container"
            ? el?.clientWidth
            : props.width
            ? props.width
            : window.innerWidth,
        height:
          props.resizeTo == "container"
            ? el?.clientHeight
            : props.height
            ? props.height
            : window.innerHeight,
        antialias: true,
      })
      .then(() => {
        el.appendChild(app.canvas);
        let viewport = new Viewport(app, {
          worldWidth: 1000,
          worldHeight: 1000,
        });
        props.onLoaded({ app, viewport });
      });
    })
  });
  return (
    <div
     class={"w-full h-screen "+ props.class}
      ref={(r) => {
        canvasContainer = r;
        props.ref = r;
      }}
    ></div>
  );
}

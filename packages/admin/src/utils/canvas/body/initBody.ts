import { Assets, Container, Graphics, GraphicsContext, Sprite } from "pixi.js";
import { PixiCanvasOnLoadedItem } from "~/components/PixiCanvas";
import { colors } from "../../functions/colors";
import { GuitarBodyState, GuitarBodySPEnum } from "~/contexts/GuitarConfigContext";
import { Owner, createEffect, runWithOwner } from "solid-js";
import { emptyGraphicsContext, emptyTexture } from "../common";
import { initBodyGizmos } from "./initBodyGizmos";

function createBodyTextureContainer(){
  const bodyMaskContainer = new Container();

  const bodyMask = Sprite.from("/assets/es.png");
  const bodyWood = Sprite.from("/assets/alder.jpg");

  const bodyMaskScale = Math.min(bodyWood.height / bodyMask.height, 1);

  bodyMask.scale.set(bodyMaskScale);

  bodyMaskContainer.mask = bodyMask;
  bodyMaskContainer.addChild(bodyWood);
  bodyMaskContainer.addChild(bodyMask);

  return bodyMaskContainer
}

export const initBody = async (ev: PixiCanvasOnLoadedItem, guitarConfig : GuitarBodyState, owner : Owner) => {
  await Assets.load(["/assets/es.png", "/assets/alder.jpg"]);

  const bodyContainer = new Container();
  const bodyTextureContainer = createBodyTextureContainer();

  bodyContainer.position.set(
    ev.viewport.world.width / 2,
    ev.viewport.world.height / 2 + bodyTextureContainer.height / 2,
  );
  bodyContainer.pivot.set(bodyTextureContainer.width / 2, bodyTextureContainer.height);

  const bodyOutlineRect = new GraphicsContext()
    .rect(bodyTextureContainer.x, bodyTextureContainer.y, bodyTextureContainer.width, bodyTextureContainer.height)
    .stroke({ color: 0x000000, width: 2 });

  const bodyOutline = new Graphics(emptyGraphicsContext);

  const bodyMaskGizmos = [bodyOutline];

  bodyContainer.addChild(bodyTextureContainer);
  bodyContainer.addChild(...bodyMaskGizmos);

  bodyContainer.interactive = true;

  bodyContainer.addEventListener("pointerover", () => {
    bodyOutline.context = bodyOutlineRect;
  });

  bodyContainer.addEventListener("pointerleave", () => {
    bodyOutline.context = emptyGraphicsContext;
  });

  const bodyShadow = new Sprite();

  bodyShadow.position.set(
    bodyContainer.width / 2,
    bodyContainer.height / 2,
  );

  bodyShadow.anchor.set(0.5);

  bodyContainer.addChild(bodyShadow);

  runWithOwner(owner, ()=>{
    createEffect(()=>{
      const tex = guitarConfig.shadow.get();
      if(!tex){
        bodyShadow.texture = emptyTexture;
        return;
      }
      bodyShadow.texture = tex;
      bodyShadow.width = bodyMask.width;
      bodyShadow.height = bodyMask.height;
    })
  })

  initBodyGizmos(ev, guitarConfig, bodyContainer, owner);

  ev.viewport.world.addChild(bodyContainer);
};
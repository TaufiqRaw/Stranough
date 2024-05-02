import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Owner, createEffect } from "solid-js";
import { colors } from "~/utils/functions/colors";
import { emptyGraphicsContext } from "../common";
import { GuitarBodyState, GuitarBodySPEnum } from "~/contexts/GuitarConfigContext";
import { PixiCanvasOnLoadedItem } from "~/components/PixiCanvas";
import { SignalObject } from "~/utils/interfaces/SignalObject";
import { createSpawnPointGizmo } from "./createSpawnPointGizmo";

export const initBodyGizmos = (ev: PixiCanvasOnLoadedItem, guitarConfig : GuitarBodyState, bodyContainer : Container, owner : Owner)=>{
  const ctx = { bodyContainer, guitarConfig, owner }; 

  createSpawnPointGizmo(GuitarBodySPEnum.fingerboard, guitarConfig.spawnPoints.fingerboard, ctx);
  createSpawnPointGizmo(GuitarBodySPEnum.bridge, guitarConfig.spawnPoints.bridge, ctx);

}
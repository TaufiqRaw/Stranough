import { Container, Graphics, GraphicsContext } from "pixi.js";
import { Owner, createEffect, runWithOwner } from "solid-js";
import { emptyGraphicsContext } from "../common";
import { GuitarBodyState, GuitarBodySPEnum } from "~/contexts/GuitarConfigContext";
import { SignalObject } from "~/utils/interfaces/SignalObject";
import { Position } from "~/utils/interfaces/Position";
import { colors } from "~/utils/functions/colors";

const spawnPointGizmo = {
  active : new GraphicsContext()
    .circle(0, 0, 7)
    .fill({ color: colors["blue-500"] })
    .stroke({ color: colors.white , width: 2 }),
  hover: new GraphicsContext()
    .circle(0, 0, 7).fill({ color: colors.white }).stroke({ color: colors.black , width: 2 }),
  normal: new GraphicsContext()
    .circle(0, 0, 5)
    .fill({ color: colors.black })
};

export function createSpawnPointGizmo(SPEnum : GuitarBodySPEnum, spPosSignal : SignalObject<Position | undefined>, ctx :{
  bodyContainer : Container,
  guitarConfig : GuitarBodyState,
  owner : Owner
}){
  const SPGraphics = new Graphics(emptyGraphicsContext);

  function resetSPGizmos(){
    if(!!spPosSignal.get()){
      SPGraphics.context = spawnPointGizmo.normal;
    }else{
      SPGraphics.context = emptyGraphicsContext;
    }
  }

  ctx.bodyContainer.addEventListener("pointerdown", (e) => {
    if(ctx.guitarConfig.spawnPoints.selected.get() === SPEnum){
      //TODO: account for sidebar width
      spPosSignal.set(
        ctx.bodyContainer.toLocal({x : e.x, y : e.y})
      );
      ctx.guitarConfig.spawnPoints.selected.set(undefined);
    }
  });

  runWithOwner(ctx.owner,()=>{
    createEffect(() => {
      const fingerboardSPPosition = spPosSignal.get();
      if(!fingerboardSPPosition) return;
  
      SPGraphics.position.set(
        fingerboardSPPosition.x,
        fingerboardSPPosition.y
      );
    })
  })

  runWithOwner(ctx.owner,()=>{
    createEffect(()=> {
      const selectedSP = ctx.guitarConfig.spawnPoints.selected.get();
      const hoveredSP = ctx.guitarConfig.spawnPoints.hovered.get();

      resetSPGizmos();

      if(selectedSP === SPEnum){
        SPGraphics.context = spawnPointGizmo.active;
        return
      }
      if(hoveredSP === SPEnum && !!spPosSignal.get()){
        SPGraphics.context = spawnPointGizmo.hover;
      }
    })
  })
  
  ctx.bodyContainer.addChild(SPGraphics);
}
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarBuilderImageButton } from "../guitar-builder-image-button";
import { GuitarBuilderSubmenu, GuitarBuilderSubmenuGroup } from "../guitar-builder.submenu";
import { Show } from "solid-js";
import { useGuitarBuilderMenuContext } from "../guitar-builder-gui";

export function ConstructionAndContourSubmenu(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return <GuitarBuilderSubmenu mustHaveModel>
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Construction Method</span>
      <div class="grid gap-2 grid-cols-2">
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.constructionMethod.get() === 'boltOnConstruction'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('boltOnConstruction');
          }}
          src="/assets/gui/bolt-on.png"
          title="Bolt On"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.constructionMethod.get() === 'setInConstruction'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('setInConstruction');
          }}
          src="/assets/gui/set-neck.png"
          title="Set Neck"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.constructionMethod.get() === 'neckThroughConstruction'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('neckThroughConstruction');
          }}
          src="/assets/gui/neck-through.png"
          title="Neck Through"/>
      </div>
    </GuitarBuilderSubmenuGroup>
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Top Contour</span>
      <div class="grid gap-2 grid-cols-2">
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'flatContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('flatContour');
          }}
          src="/assets/gui/top-flat-contour.png"
          title="Flat"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'forearmContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('forearmContour');
          }}
          src="/assets/gui/top-forearm-contour.png"
          title="Forearm"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'carvedContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('carvedContour');
          }}
          src="/assets/gui/top-carved-contour.png"
          title="Carved"/>
      </div>
    </GuitarBuilderSubmenuGroup>
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Back Contour</span>
      <div class="grid gap-2 grid-cols-2">
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'flatContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('flatContour');
          }}
          src="/assets/gui/back-flat-contour.png"
          title="Flat"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'tummyContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('tummyContour');
          }}
          src="/assets/gui/back-tummy-contour.png"
          title="Tummy"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'carvedContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('carvedContour');
          }}
          src="/assets/gui/back-carved-contour.png"
          title="Carved"/>
      </div>
    </GuitarBuilderSubmenuGroup>
  </GuitarBuilderSubmenu>
}
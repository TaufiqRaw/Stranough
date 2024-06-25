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
          isActive={guitarBuilderCtx.constructionMethod.get() === 'boltOnBody'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('boltOnBody');
          }}
          src="/assets/gui/bolt-on.png"
          title="Bolt On"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.constructionMethod.get() === 'setInBody'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('setInBody');
          }}
          src="/assets/gui/set-neck.png"
          title="Set Neck"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.constructionMethod.get() === 'neckThroughBody'}
          onClick={() =>{
            guitarBuilderCtx.constructionMethod.set('neckThroughBody');
          }}
          src="/assets/gui/neck-through.png"
          title="Neck Through"/>
      </div>
    </GuitarBuilderSubmenuGroup>
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Top Contour</span>
      <div class="grid gap-2 grid-cols-2">
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'topFlatContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('topFlatContour');
          }}
          src="/assets/gui/top-flat-contour.png"
          title="Flat"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'topForearmContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('topForearmContour');
          }}
          src="/assets/gui/top-forearm-contour.png"
          title="Forearm"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.topContour.get() === 'topCarvedContour'}
          onClick={() =>{
            guitarBuilderCtx.topContour.set('topCarvedContour');
          }}
          src="/assets/gui/top-carved-contour.png"
          title="Carved"/>
      </div>
    </GuitarBuilderSubmenuGroup>
    <GuitarBuilderSubmenuGroup>
      <span class="text-sm -mt-1">Back Contour</span>
      <div class="grid gap-2 grid-cols-2">
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'backFlatContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('backFlatContour');
          }}
          src="/assets/gui/back-flat-contour.png"
          title="Flat"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'backTummyContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('backTummyContour');
          }}
          src="/assets/gui/back-tummy-contour.png"
          title="Tummy"/>
        <GuitarBuilderImageButton
          isActive={guitarBuilderCtx.backContour.get() === 'backCarvedContour'}
          onClick={() =>{
            guitarBuilderCtx.backContour.set('backCarvedContour');
          }}
          src="/assets/gui/back-carved-contour.png"
          title="Carved"/>
      </div>
    </GuitarBuilderSubmenuGroup>
  </GuitarBuilderSubmenu>
}
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import SimpleBar from 'simplebar';
import Swiper from "swiper";
import BottomChildSideMenu from "./BottomChildSideMenu";

export default function BottomChildMenu(
  props : {
    items : { title : string }[],
    selectedSubmenuIndex : () => number,
    onSelectSubmenu : (index : number) => void,
    active : boolean
  }
){
  let parentRef : HTMLDivElement | undefined;
  const [isSideMenuExpanded, setIsSideMenuExpanded] = createSignal(true);

  return <div 
    ref={parentRef}
    class={'bottom-child-menu util-bg h-44 mb-3 rounded-md overflow-hidden ' 
    + (props.active ? 'active' : '')
    + (isSideMenuExpanded() ? ' side-menu-expanded' : '')
    }>

    <BottomChildSideMenu items={props.items} isSideMenuExpanded={isSideMenuExpanded} onSelectSubmenu={props.onSelectSubmenu} parentRef={parentRef} selectedSubmenuIndex={props.selectedSubmenuIndex} setIsSideMenuExpanded={setIsSideMenuExpanded} />
    
    {/* ------------ Content ---------- */}
    <div class="w-full" onClick={()=>setIsSideMenuExpanded(false)}>

    </div>
  </div>
}
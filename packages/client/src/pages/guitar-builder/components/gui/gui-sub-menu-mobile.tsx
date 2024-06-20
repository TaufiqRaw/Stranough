import { createSignal } from "solid-js";
import GuiSubMenuSideMobile from "./gui-sub-menu-side-mobile";

export default function GuiSubMenuMobile(
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
    class={'opacity-0 transition-all pointer-events-none transform duration-300 relative flex bg-gray-800 h-44 mb-3 rounded-md overflow-hidden ' 
    + (props.active ? 'z-[1] opacity-100 pointer-events-auto translate-y-0' : 'translate-y-10')
    }>

    <GuiSubMenuSideMobile items={props.items} isSideMenuExpanded={isSideMenuExpanded} onSelectSubmenu={props.onSelectSubmenu} parentRef={parentRef} selectedSubmenuIndex={props.selectedSubmenuIndex} setIsSideMenuExpanded={setIsSideMenuExpanded} />
    
    {/* ------------ Content ---------- */}
    <div class="w-full" onClick={()=>setIsSideMenuExpanded(false)}>

    </div>
  </div>
}
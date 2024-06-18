import { createSignal } from "solid-js";
import { guitarBuilderMenu } from "./constants";
import { IGuitarBuilderMenuContainer, IGuitarBuilderMenu } from "./types";
import { createSignalObject } from "~/commons/functions/signal-object.util";

export function createMenu() : IGuitarBuilderMenuContainer{
  const selectedMenu = createSignalObject<number>();
  //@ts-ignore
  const submenus = guitarBuilderMenu.map<IGuitarBuilderMenu>((m) => {
    const selectedChildren = createSignalObject<number>(0);
    return {
      ...m,
      getSelectedChildrenObj() {
        return typeof selectedChildren.get() !== 'undefined' ? m.children[selectedChildren.get()!] : undefined;
      },
      setSelectedChildren : (s: typeof guitarBuilderMenu[number]['children'][number]['title'])=>{
        const index = m.children.findIndex((c)=>c.title === s);
        if(index !== -1){
          selectedChildren.set(index);
        };
      },
      selectedChildren,
    };
  });
  return {
    selectedMenu,
    setSelectedMenu : (s : typeof guitarBuilderMenu[number]['caption'])=>{
      const index = submenus.findIndex((m)=>m.caption === s);
      if(index !== -1){
        selectedMenu.set(index);
      };
    },
    setSelectedSubmenu : (s : typeof guitarBuilderMenu[number]['children'][number]['title'])=>{
      let submenuIndex = -1;
      let menuIndex = -1;

      for(let i = 0; i < submenus.length; i++){
        const submenu = submenus[i];
        const index = submenu.children.findIndex((c)=>c.title === s);
        if(index !== -1){
          submenuIndex = index;
          menuIndex = i;
          break;
        }
      }
      if(submenuIndex !== -1 && menuIndex !== -1){
        selectedMenu.set(menuIndex);
        submenus[menuIndex].selectedChildren.set(submenuIndex);
      }
    },
    getSelectedMenuObj() {
      return typeof selectedMenu.get() !== 'undefined' ? submenus[selectedMenu.get()!] : undefined;
    },
    menus : submenus,
  }
}
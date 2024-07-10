import { For, Show, createContext, useContext } from "solid-js";
import GuiSubMenuMobile from "./gui-sub-menu-mobile";
import { createMenu } from "../../utils/create-menu";
import { IGuitarBuilderMenuContainer } from "../../utils/types";
import { useGuitarBuilderContext } from "../../guitar-builder";

const guitarBuilderGuiMenuCtx = createContext<IGuitarBuilderMenuContainer>()

export function useGuitarBuilderMenuContext(){
  return useContext(guitarBuilderGuiMenuCtx)
}

export default function GuitarBuilderGui() {
  const menuContainer = createMenu();
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  
  return <guitarBuilderGuiMenuCtx.Provider value={menuContainer}>
    <div class="absolute top-0 w-full h-full left-0">
      <div class="relative h-full">
        <div class="absolute z-[1] top-0 left-0 w-full p-3 flex flex-col lg:w-80 lg:h-screen gap-2">
          <div class="relative flex flex-col lg:hidden">
            <For each={menuContainer.menus}>
              {(menu, i) => (
                <div class="absolute bottom-0 w-full">
                  <GuiSubMenuMobile
                    onSelectSubmenu={menu.selectedChildren.set}
                    selectedSubmenuIndex={menu.selectedChildren.get}
                    items={menu.children}
                    active={menuContainer.selectedMenu.get() == i()}
                  />
                </div>
              )}
            </For>
          </div>
          <div class="h-20 bg-gray-700 rounded-md grid grid-cols-4 place-items-center px-5 bottom-menu">
            <For each={menuContainer.menus}>
              {(menu, i) => (
                <div
                  onClick={() => menuContainer.selectedMenu.set(i())}
                  class={
                    "item w-full relative h-20 py-5 " +
                    (menuContainer.selectedMenu.get() === i() ? "active" : "")
                  }
                >
                  <menu.Icon />
                  <div class="text-white absolute w-full flex justify-center caption">
                    <div class="text-sm">{menu.caption}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div class="hidden lg:flex flex-col bg-gray-800 grow rounded-md overflow-hidden">
            <div class="h-32 bg-gray-700 flex flex-col gap-1 text-white-950 overflow-auto">
              <For each={menuContainer.menus}>
                {(menu, i) => (
                  <Show when={menuContainer.selectedMenu.get() === i()}>
                    <For each={menu.children}>
                      {(submenu, j) => <Show
                        when={submenu.checkAvailability ? submenu.checkAvailability(guitarBuilderCtx) : true}
                      >
                        <div
                          class={
                            "submenu-item px-2 py-1 first:mt-2 last:mb-2 cursor-pointer " +
                            (menu.selectedChildren.get() === j()
                              ? "bg-blue-500"
                              : "")
                          }
                          onClick={() => menu.selectedChildren.set(j())}
                        >
                          {submenu.title}
                        </div>
                      </Show>}
                    </For>
                  </Show>
                )}
              </For>
            </div>
            <div class="flex-1 overflow-auto">
              {menuContainer.getSelectedMenuObj()?.getSelectedChildrenObj()?.component?.()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </guitarBuilderGuiMenuCtx.Provider>
}


import GeneralIcon from './icons/GeneralIcon';
import BodyIcon from './icons/BodyIcon';
import FingerboardIcon from './icons/FingerboardIcon';
import ElectronicIcon from './icons/ElectronicIcon';
import ComponentIcon from './icons/ComponentIcon';
import BottomMenuItem from './BottomMenu/BottomMenuItem';
import BottomChildMenu from './BottomMenu/BottomChildMenu';
import { Component, For, createSignal } from 'solid-js';

interface Submenu {
  title : string;
  menu : Component<any>;
}

export interface Menu {
  caption : string;
  Icon : any;
  children : Submenu[];
}

const _menu = [
  { 
    caption: 'General', 
    Icon: GeneralIcon,
    children : [
      { title : 'Model' },
      { title : 'Dexterity'},
    ]
  },
  { 
    caption: 'Body', 
    Icon: BodyIcon,
    children : [
      { title : 'Body Type' },
      { title : 'Body Material'},
      { title : 'Body Finish'},
    ]
  },
  { 
    caption: 'Neck',
    Icon: FingerboardIcon,
    children : [
      { title : 'Neck Type' },
      { title : 'Neck Material'},
      { title : 'Neck Finish'},
    ]
  },
  { 
    caption: 'Electronics', 
    Icon: ElectronicIcon,
    children : [
      { title : 'Pickups' },
      { title : 'Controls'},
    ]
  },
  { 
    caption: 'Components', 
    Icon: ComponentIcon,
    children : [
      { title : 'Tuners' },
      { title : 'Bridge'},
      { title : 'Nut'},
      { title : 'Strings'},
    ]
  },
]

export default function UserGUI() {
  const [selectedMenu, setSelectedMenu] = createSignal(-1);

  // Create a signal for each menu item that will hold the selected submenu index
  const menu = _menu.map((m)=>{
    const [selectedSubmenu, setSelectedSubmenu] = createSignal(0); 
    return {
      ...m,
      selectedSubmenu,
      setSelectedSubmenu,
    }
  })

  return <div class="absolute top-0 w-full h-full left-0">
    <div class="relative h-full">
      <div class='absolute z-0 top-0 left-0 w-full h-full' onClick={()=>setSelectedMenu(-1)}></div>
      <div class="absolute z-[1] bottom-0 left-0 w-full p-3">
        <div class='relative'>
            <For each={menu}>
            {(menu, i) => <div class='absolute bottom-0 w-full'>
              <BottomChildMenu
                onSelectSubmenu={menu.setSelectedSubmenu}
                selectedSubmenuIndex={menu.selectedSubmenu} 
                items={menu.children} 
                active={selectedMenu() == i()}/>
            </div>}
          </For>
        </div>
        <div class="h-20 util-bg rounded-md grid grid-cols-5 place-items-center px-5 bottom-menu">
          <For each={menu}>
            {(menu, i) => <BottomMenuItem onClick={()=>setSelectedMenu(i())} active={selectedMenu() == i()} caption={menu.caption} Icon={menu.Icon}/>}
          </For>
        </div>
      </div>
    </div>
  </div>
};
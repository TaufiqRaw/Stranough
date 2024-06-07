import { Viewport } from "~/commons/components/viewport";
import { GuitarBuilderPresenter } from "./components/guitar-builder.presenter";
import { Chatbox } from "./components/chatbox";
import { createContext, useContext } from "solid-js";
import { IGuitarComponent } from "./utils/types";
import { createGuitarComponent } from "./utils/create-guitar-component";

const selectedGuitarComponentCtx = createContext< IGuitarComponent | undefined>();

export function GuitarBuilder(){
  const guitarComponent = createGuitarComponent();
  return (
    <div class="relative h-screen">
      <selectedGuitarComponentCtx.Provider value={guitarComponent}>
        <Chatbox/>
        <Viewport
          displayCenterIndicator={false}
          background={0xf3f4f6}
        >
          <GuitarBuilderPresenter/>
        </Viewport>
      </selectedGuitarComponentCtx.Provider>
    </div>
  )
}

export function useSelectedGuitarComponent(){
  return useContext(selectedGuitarComponentCtx);
}
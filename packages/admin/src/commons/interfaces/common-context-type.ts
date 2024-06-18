import { Accessor, Resource, Setter } from "solid-js"
import { GuitarBodyTextureKeyType, ElectricModel, GuitarModelBodyKeyType } from "~/pages/admin/electric-model-editor/utils/types"
import { SignalObject } from "./signal-object"
import { Position } from "./position"
import { Texture } from "pixi.js"
import { Headstock } from "~/pages/admin/headstock-editor/utils/types"

export interface ViewportContextType<TexKey extends string>{
  textures : {[x in TexKey] : ()=>Texture},
  isFront : {
    get : Accessor<boolean>,
  },
  screenHeight : Accessor<number>,
  screenWidth : Accessor<number>,
}

export interface EditorPageContextType{
  modelPreview : ModelPreview,
  headstockPreview : HeadstockPreview,
}

type HeadstockPreview = {
  id: Accessor<number | undefined>,
  setId: Setter<number | undefined>,
  selectedHeadstock : Resource<Headstock | undefined>,
  isShowHeadstockPreview : SignalObject<boolean>,
}


type ModelPreview = {
  id : () => number | undefined,
  setId : (i : number) => void,
  selectedModel : Resource<ElectricModel | undefined>,
  selectedTexture : () => GuitarBodyTextureKeyType | undefined,
  selectedBody : () => GuitarModelBodyKeyType | undefined,
  setSelectedTexture : (t : GuitarBodyTextureKeyType | undefined) => void,
  setSelectedBody : (b : GuitarModelBodyKeyType | undefined) => void,
  isShowModelPreview : SignalObject<boolean>,
}
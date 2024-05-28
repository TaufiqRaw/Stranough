import { Resource } from "solid-js"
import { GuitarBodyTextureKeyType, GuitarModel, GuitarModelBodyKeyType } from "~/pages/model-editor/utils/types"
import { SignalObject } from "./signal-object"
import { Position } from "./position"
import { Texture } from "pixi.js"

export interface EditorPageContextType<TexObj extends {[x : string] : ()=>Texture}> {
  modelPreview : ModelPreview,
  textures : TexObj,
  isFront : SignalObject<boolean>,
}

type ModelPreview = {
  id : () => number | undefined,
  setId : (i : number) => void,
  selectedModel : Resource<GuitarModel | undefined>,
  selectedTexture : () => GuitarBodyTextureKeyType | undefined,
  selectedBody : () => GuitarModelBodyKeyType | undefined,
  setSelectedTexture : (t : GuitarBodyTextureKeyType | undefined) => void,
  setSelectedBody : (b : GuitarModelBodyKeyType | undefined) => void,
  isShowModelPreview : SignalObject<boolean>,
  textures : ()=>{
    defaultMask?: string;
    defaultMaskScale?: number;
    mask?: string;
    backMask?: string;
    frontShadowTexture?: string;
    backShadowTexture?: string;
    frontSpecularTexture?: string;
    backSpecularTexture?: string;
    frontHoleMask?: string;
    scale?: number;
  } | undefined,
  spawnpoints : ()=>{
    fingerboard : Position | undefined,
    bridge : Position | undefined,
    switch : {x: number | undefined, y : number | undefined, rotation : number} | undefined,
    jack : {
      side : {x: number | undefined, y : number | undefined, rotation : number} | undefined,
      top : {x: number | undefined, y : number | undefined, rotation : number} | undefined,
    },
    pickup : {
      neck : Position | undefined,
      middle : Position | undefined,
      bridge : Position | undefined,
    },
    knobs : (Position | undefined)[],
  } | undefined,
}
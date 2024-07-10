import { JSX } from "solid-js";
import { Position } from "../interfaces/position";
import { ImageType } from "../interfaces/image-type";
import {ElectricModel as ElectricModelConfig, Pickup} from 'stranough-common'

export interface ElecticModelPresenterProps {
  children?: JSX.Element;
  isFront?: boolean;
  neckWood?: string;
  body: {
    mask?: string;
    backMask?: string;
    type?: typeof ElectricModelConfig.constructionKeys[number];
    frontShadowTexture?: string;
    backShadowTexture?: string;
    frontSpecularTexture?: string;
    backSpecularTexture?: string;
    scale?: number;
    topWood?: string;
    coreWood?: string;
  };
  onGuitarClick?: (e: { x: number; y: number }) => void;
  spawnpoints: {
    fingerboard?: Position;
    bridge?: Position;
    switch?: { x: number | undefined; y: number | undefined; rotation: number };
    jack?: {
      side?: { x: number | undefined; y: number | undefined; rotation: number };
      top?: { x: number | undefined; y: number | undefined; rotation: number };
    };
    pickup?: {
      neck?: Position;
      middle?: Position;
      bridge?: Position;
    };
    pickguard?: Position;
    knobs?: (Position | undefined)[];
  };
  colorOverlay?: ()=>JSX.Element;
  fingerboard?: () => JSX.Element;
  bridge?: () => JSX.Element;
  switch?: () => JSX.Element;
  pickguard?: () => JSX.Element;
  jack?: {
    side?: () => JSX.Element;
    top?: () => JSX.Element;
  };
  pickup?: {
    type : typeof Pickup.pickupConfigurations[number];
    items : [(()=>JSX.Element) | undefined] | [(()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined] | [(()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined];
  };
  knobs?: (() => JSX.Element)[];
}

export interface AcousticModelPresenterProps{
  children?: JSX.Element;
  isFront?: boolean;
  neckWood?: string;
  body: {
    mask?: string;
    shadowTexture?: string;
    specularTexture?: string;
    scale?: number;
    topWood?: string;
    backWood?: string;
  };
  onGuitarClick?: (e: { x: number; y: number }) => void;
  spawnpoints: {
    fingerboard?: Position;
    bridge?: Position;
    jack?: { x: number | undefined; y: number | undefined; rotation: number };
  };
  colorOverlay?: ()=>JSX.Element;
  fingerboard?: () => JSX.Element;
  bridge?: () => JSX.Element;
  jack?: () => JSX.Element;
  pickguard?: () => string | undefined;
}
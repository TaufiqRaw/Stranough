import { Accessor, JSX, Setter } from "solid-js";
import { PosRotWithFlipped, Position, PositionWithRotation } from "../interfaces/position";
import { ImageType } from "../interfaces/image-type";
import {Bridge as BridgeConfig, ElectricModel as ElectricModelConfig, Pickup} from 'stranough-common'
import { Point, Texture } from "pixi.js";

export interface ElecticModelPresenterProps {
  children?: JSX.Element;
  isFront?: boolean;
  neckWood?: string;
  setOnRender? : Setter<(()=>Promise<HTMLImageElement| undefined>) | undefined>;
  body: {
    mask?: string;
    type?: typeof ElectricModelConfig.constructionKeys[number];
    electronicOverlayTexture?: string;
    topContourTexture?: string;
    backContourTexture?: string;
    scale?: number;
    topWood?: string;
    coreWood?: string;
    leftMostPoint?: Position;
  };
  onGuitarClick?: (e: { x: number; y: number }) => void;
  spawnpoints: {
    electronicCover?: { x: number | undefined; y: number | undefined; rotation: number };
    batteryCover?: { x: number | undefined; y: number | undefined; rotation: number };
    borderPoints?: Position[] | undefined;
    bridge?: Position;
    topEnd?: Position;
    bottomEnd?: Position;
    leftHole?: { x: number | undefined; y: number | undefined; rotation: number };
    rightHole?: { x: number | undefined; y: number | undefined; rotation: number };
    switch?: { x: number | undefined; y: number | undefined; rotation: number };
    jack?: {
      side?: { x: number | undefined; y: number | undefined; rotation: number };
      top?: { x: number | undefined; y: number | undefined; rotation: number };
    };
    pickguard?: Position;
    knobs?: (Position | undefined)[];
  };
  mirrorHole?: boolean;
  holeScale?: number;
  stringCount ?: ()=>number | undefined;
  colorOverlay?: ()=>JSX.Element;
  fingerboard?: () => JSX.Element;
  bridge?: [
    {render : () => JSX.Element, type : `${BridgeConfig.BridgeType}`, bottom : Position, bottomPointY : number}  | undefined, 
    {render : () => JSX.Element, type : `${BridgeConfig.BridgeType}`, bottom : Position, bottomPointY : number} | undefined
  ];
  switch?: () => JSX.Element;
  pickguard?: () => JSX.Element;
  jack?: {
    side?: () => JSX.Element;
    top?: () => JSX.Element;
  };
  pickup?: {
    type : typeof Pickup.pickupConfigurations['electric-bass'][keyof typeof Pickup.pickupConfigurations['electric-bass']] | typeof Pickup.pickupConfigurations['electric-guitar'][keyof typeof Pickup.pickupConfigurations['electric-guitar']];
    items : [(()=>JSX.Element) | undefined] | [(()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined] | [(()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined, (()=>JSX.Element) | undefined];
  };
  bridgeToBottom?: ()=>number | undefined;
  knobs?: (() => JSX.Element)[];
}

export interface AcousticModelPresenterProps{
  children?: JSX.Element;
  isFront?: boolean;
  neckWood?: string;
  body: {
    mask?: Texture;
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

export interface HeadstockPresenterProps {
  neckWoodTexture?: string;
  texture?: string;
  frontShadowTexture?: string;
  backShadowTexture?: string;
  pivot?: Position;
  scale?: number;
  onClick?: (e: Point) => void;
  children?: JSX.Element;
  isFront?: ()=>boolean | undefined;
  pegs?: (() => JSX.Element)[];
  pegsSpawnPoint ?: PosRotWithFlipped[];
  isSlotted?: ()=>boolean | undefined;
  slottedGuardSpawnPoint?: PositionWithRotation[];
  slottedGuardLength?: ()=>number | undefined;
  slottedRodOffset?: ()=>number | undefined;
}

export interface PegPresenterProps {
  texture ?: {
    cap ?: string;
    back ?: string;
    rod ?: string;
  };
  forSlottedHeadstock?: boolean;
  pivot?: Position;
  backPivot?: Position;
  rodPivot?: Position;
  scale?: number;
  isFront?: ()=>boolean | undefined;
  onCapClick?: (e: Point) => void;
  onBackClick?: (e: Point) => void;
  onRodClick?: (e: Point) => void;
  children?: JSX.Element;
  backChildren ?: JSX.Element;
  rodChildren ?: JSX.Element;
  zIndex?: number;
  clickable ?: ()=> 'rod' | 'back' | 'cap' | undefined;
}
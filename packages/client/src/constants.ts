import { Color, Graphics, GraphicsContext } from "pixi.js";
import { DrawCalls } from "solid-pixi";
import { Colors, GuitarBuilder } from "stranough-common";
import * as R from "remeda";

export namespace Constants {
  export const defaultImgUrl = 'https://via.placeholder.com/150';
  export const serverPort = import.meta.env.VITE_SERVER_PORT;
  export const appUrl = import.meta.env.VITE_APP_URL;
  export const serverUrl = `${import.meta.env.VITE_SERVER_URL}${serverPort ? `:${serverPort}` : ''}`;
  export const serverImgUrl = `${serverUrl}/${import.meta.env.VITE_SERVER_IMAGES_URL}`;
  export const indicatorGraphicDraw : DrawCalls = [
    ['rect', -2,-2,4,4],
    ['fill', new Color('blue')]
  ] as const;
  export const emptyGraphics = new GraphicsContext();
  export const defaultPos = {
    x: 0,
    y: 0,
  };

  export const NECK_BOTTOM_WIDTH = 76;
  export const NECK_TOP_WIDTH = 60;

  export const fHoleTexture = '/assets/holes/f.svg';

  export const burstTexture = '/assets/burst.png';
  export const smallBurstTexture = '/assets/small-burst.png';

  export const neckProfileImages : {[k in keyof typeof GuitarBuilder.neckProfiles] : string} = {
    asymmetric : "/assets/gui/neck-profile/asymmetric.png",
    c : "/assets/gui/neck-profile/c.png",
    d : "/assets/gui/neck-profile/d.png",
    u : "/assets/gui/neck-profile/u.png",
    v : "/assets/gui/neck-profile/v.png",
  }

  export const neckProfileMask : {[k in keyof typeof GuitarBuilder.neckProfiles] : string} = {
    asymmetric : "/assets/neck-profile/asymmetric.svg",
    c : "/assets/neck-profile/c.svg",
    d : "/assets/neck-profile/d.svg",
    u : "/assets/neck-profile/u.svg",
    v : "/assets/neck-profile/v.svg",
  }

  export const purflingUrl : {[k in keyof typeof GuitarBuilder.bindings] : string} = {
    "1-ply-pvc" : '/assets/purfling/pvc.png',
    "3-ply-pvc" : '/assets/purfling/pvc.png',
    "5-ply-pvc" : '/assets/purfling/pvc.png',
    "abalone" : '/assets/purfling/pvc.png',
    "herringbone-purfling" : '/assets/purfling/herringbone.png',
    "pearloid" : '/assets/purfling/pvc.png',
    "mother-of-pearl" : '/assets/purfling/pvc.png',
    "synthetic-abalone" : '/assets/purfling/pvc.png',
    "wood-purfling" : '/assets/purfling/wood.png',
  }

  export function getPurflingUrl(key : keyof typeof purflingUrl | undefined) {return key ? purflingUrl[key] : undefined};

  export const bindingUrl : {[k in keyof typeof GuitarBuilder.bindings] : string} = {
    "1-ply-pvc" : '/assets/purfling/1-ply-pvc.png',
    "3-ply-pvc" : '/assets/purfling/3-ply-pvc.png',
    "5-ply-pvc" : '/assets/purfling/5-ply-pvc.png',
    "abalone" : '/assets/purfling/abalone.png',
    "herringbone-purfling" : '/assets/purfling/1-ply-pvc.png',
    "pearloid" : '/assets/purfling/pearloid.png',
    "mother-of-pearl" : '/assets/purfling/mother-of-pearl.png',
    "synthetic-abalone" : '/assets/purfling/synthetic-abalone.png',
    "wood-purfling" : '/assets/purfling/wood.png',
  }

  export function getBindingUrl(key : keyof typeof bindingUrl | undefined) {return key ? bindingUrl[key] : undefined};

  //TODO: make assets for these
  export const bindingThumbnails : {[k in keyof typeof GuitarBuilder.bindings] : string} = {
    "1-ply-pvc" : "/assets/gui/1-ply-pvc.png",
    "3-ply-pvc" : "/assets/gui/3-ply-pvc.png",
    "5-ply-pvc" : "/assets/gui/5-ply-pvc.png",
    "herringbone-purfling" : "/assets/gui/herringbone-purfling.png",
    "mother-of-pearl" : "/assets/gui/mother-of-pearl.png",
    "synthetic-abalone" : "/assets/gui/synthetic-abalone.png",
    "wood-purfling" : "/assets/gui/wood-purfling.png",
    abalone : "/assets/gui/abalone.png",
    pearloid : "/assets/gui/pearloid.png",
  }

  export const metallicColorUrl : {[k in keyof typeof Colors.metallicColors] : string} = R.keys(Colors.metallicColors).reduce((acc, curr)=>{
    acc[curr as keyof typeof Colors.metallicColors] = `/assets/metallic/${curr}.jpg`;
    return acc;
  }, {} as {-readonly [k in keyof typeof Colors.metallicColors] : string});

  export const trussRodImage = Object.freeze({
    "spoke-wheel" : "/assets/truss-rod/spoke-wheel.png",
    "headstock" : "/assets/truss-rod/headstock.png",
  } as const);
  
  export const woodUrl : {
    [k in (keyof typeof GuitarBuilder.neckWoods | keyof typeof GuitarBuilder.bodyTopWoods | keyof typeof GuitarBuilder.bodyCoreWoods | keyof typeof GuitarBuilder.fingerboardWoods) ] : string
  } = {
    'alder' : '/assets/woods/alder.jpg',
    'korina-black' : '/assets/woods/korina-black.jpg',
    'korina-white' : '/assets/woods/korina-white.jpg',
    'mahogany' : '/assets/woods/mahogany.jpg',
    '1-piece-mahogany' : '/assets/woods/1-piece-mahogany.jpg',
    'plain-maple' : '/assets/woods/plain-maple.jpg',
    'flamed-maple' : '/assets/woods/flamed-maple.jpg',
    'quilted-maple' : '/assets/woods/quilted-maple.jpg',
    'rosewood' : '/assets/woods/rosewood.jpg',
    'swamp-ash' : '/assets/woods/swamp-ash.jpg',
    'walnut' : '/assets/woods/walnut.jpg',
    'ebony' : '/assets/woods/ebony.jpg',
    'pau-ferro' : '/assets/woods/pau-ferro.jpg',
    "bird-eyes-maple" : '/assets/woods/bird-eyes-maple.jpg',
    "hard-maple" : '/assets/woods/hard-maple.jpg',
    "laminated-amboyna-burl" : '/assets/woods/amboyna-burl.jpg',
    "laminated-flamed-maple" : '/assets/woods/flamed-maple.jpg',
    "laminated-plain-maple" : '/assets/woods/plain-maple.jpg',
    "laminated-quilted-maple" : '/assets/woods/quilted-maple.jpg',
    "laminated-rosewood" : '/assets/woods/rosewood.jpg',
    "laminated-walnut" : '/assets/woods/walnut.jpg',
    "quartersawn-maple" : '/assets/woods/quartersawn-maple.jpg',
    "roasted-maple" : '/assets/woods/roasted-maple.jpg',
    "solid-alder" : '/assets/woods/alder.jpg',
    "solid-amboyna-burl" : '/assets/woods/amboyna-burl.jpg',
    "solid-flamed-mango" : '/assets/woods/flamed-mango.jpg',
    "solid-flamed-maple" : '/assets/woods/flamed-maple.jpg',
    "solid-hard-maple" : '/assets/woods/hard-maple.jpg',
    "solid-korina-black" : '/assets/woods/korina-black.jpg',
    "solid-korina-white" : '/assets/woods/korina-white.jpg',
    "solid-mahogany" : '/assets/woods/mahogany.jpg',
    "solid-quilted-maple" : '/assets/woods/quilted-maple.jpg',
    "solid-rosewood" : '/assets/woods/rosewood.jpg',
    "solid-swamp-ash" : '/assets/woods/swamp-ash.jpg',
    "solid-spalted-maple" : '/assets/woods/spalted-maple.jpg',
    "solid-spalted-tamarind" : '/assets/woods/spalted-tamarind.jpg',
    "solid-walnut" : '/assets/woods/walnut.jpg',
    "solid-white-ash" : '/assets/woods/white-ash.jpg',
    "white-ash" : '/assets/woods/white-ash.jpg',
  }

  export const pickguardMaterial : {
    [k in keyof typeof GuitarBuilder.pickguardMaterials] : string
  } = {
    "1-ply-black-pvc" : '/assets/pickguards/1-ply-black-pvc.png',
    "1-ply-blue-pvc" : '/assets/pickguards/1-ply-blue-pvc.png',
    "1-ply-ivory-pvc" : '/assets/pickguards/1-ply-ivory-pvc.png',
    "1-ply-red-pvc" : '/assets/pickguards/1-ply-red-pvc.png',
    "1-ply-transparent-acrylic" : '/assets/pickguards/1-ply-transparent-acrylic.png',
    "1-ply-white-pvc" : '/assets/pickguards/1-ply-white-pvc.png',
    "2-ply-blue-mirror" : '/assets/pickguards/2-ply-blue-mirror.png',
    "2-ply-chrome-mirror" : '/assets/pickguards/2-ply-chrome-mirror.png',
    "2-ply-gold-mirror" : '/assets/pickguards/2-ply-gold-mirror.png',
    "2-ply-red-mirror" : '/assets/pickguards/2-ply-red-mirror.png',
    "3-ply-black-pearloid" : '/assets/pickguards/3-ply-black-pearloid.png',
    "3-ply-black-pvc" : '/assets/pickguards/3-ply-black-pvc.png',
    "3-ply-blue-pearloid" : '/assets/pickguards/3-ply-blue-pearloid.png',
    "3-ply-green-pearloid" : '/assets/pickguards/3-ply-green-pearloid.png',
    "3-ply-ivory-pearloid" : '/assets/pickguards/3-ply-ivory-pearloid.png',
    "3-ply-red-pearloid" : '/assets/pickguards/3-ply-red-pearloid.png',
    "3-ply-tortoise" : '/assets/pickguards/3-ply-tortoise.png',
    "3-ply-white-pearloid" : '/assets/pickguards/3-ply-white-pearloid.png',
    "3-ply-white-pvc" : '/assets/pickguards/3-ply-white-pvc.png',
    "diamond-plate-1-plate" : '/assets/pickguards/diamond-plate-1-plate.png',
    "diamond-plate-2-plate" : '/assets/pickguards/diamond-plate-2-plate.png',
    "diamond-style-artificial" : '/assets/pickguards/diamond-style-artificial.png',
    "flamed-maple-veneer" : '/assets/pickguards/flamed-maple-veneer.png',
    "quilted-maple-veneer" : '/assets/pickguards/quilted-maple-veneer.png',
    "rosewood-veneer" : '/assets/pickguards/rosewood-veneer.png',
  }
  export const getWoodUrl = (key ?: keyof typeof woodUrl) => key ? woodUrl[key] : undefined;
}

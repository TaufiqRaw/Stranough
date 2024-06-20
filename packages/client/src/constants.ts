import { Color, Graphics, GraphicsContext } from "pixi.js";
import { DrawCalls } from "solid-pixi";

export namespace Constants {
  export const defaultImgUrl = 'https://via.placeholder.com/150';
  export const serverPort = import.meta.env.VITE_SERVER_PORT;
  export const serverUrl = `${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}`;
  export const serverImgUrl = `${serverUrl}/${import.meta.env.VITE_SERVER_IMAGES_URL}`;
  export const indicatorGraphicDraw : DrawCalls = [
    ['circle', 0, 0, 10],
    ['fill', new Color('blue')]
  ] as const;
  export const emptyGraphics = new GraphicsContext();
  export const defaultPos = {
    x: 0,
    y: 0,
  };

  export const woodUrl = {
    'alder' : '/assets/woods/alder.jpg',
    'korina-black' : '/assets/woods/korina-black.jpg',
    'korina-white' : '/assets/woods/korina-white.jpg',
    'mahogany' : '/assets/woods/mahogany.jpg',
    'maple-burl' : '/assets/woods/maple-burl.jpg',
    'plain-maple' : '/assets/woods/plain-maple.jpg',
    'flamed-maple' : '/assets/woods/flamed-maple.jpg',
    'quilted-maple' : '/assets/woods/quilted-maple.jpg',
    'spalted-maple' : '/assets/woods/spalted-maple.jpg',
    'rosewood' : '/assets/woods/rosewood.jpg',
    'swamp-ash' : '/assets/woods/swamp-ash.jpg',
    'walnut' : '/assets/woods/walnut.jpg',
  }
  export const getWoodUrl = (key ?: keyof typeof woodUrl) => key ? woodUrl[key] : undefined;
}

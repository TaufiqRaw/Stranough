import { Color, Graphics, GraphicsContext } from "pixi.js";
import { DrawCalls } from "solid-pixi";

export namespace Constants {
  export const defaultImgUrl = 'https://via.placeholder.com/150';
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
}

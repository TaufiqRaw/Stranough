import { Application, Container, Graphics } from "pixi.js";
import _ from 'lodash';
import { colors } from "../functions/colors";

interface Options {
  worldWidth : number,
  worldHeight : number, 
}

const MIN_SCALE = 0.75;
const MAX_SCALE = 1.75;

export default class Viewport {
  readonly world : Container;

  constructor(app : Application, {
    worldWidth, 
    worldHeight
  }: Options){
    this.world = new Container({
      x : app.screen.width / 2,
      y : app.screen.height / 2,
      pivot : {x : worldWidth/2, y : worldHeight/2}
    });
    const background = new Graphics()
      .rect(0, 0, worldWidth, worldHeight)
      .fill(colors.white);
    background.alpha = 0;

    app.canvas.addEventListener('wheel', (e)=>{
      let targetScale = Math.max(
        MIN_SCALE, 
        Math.min(
          MAX_SCALE,
          this.world.scale.x - e.deltaY * 0.01
        )
      );
      this.world.scale.set(targetScale);
    });

    app.canvas.addEventListener('pointerdown', (e)=>{
      let lastX = e.clientX;
      let lastY = e.clientY;

      let move = (e : MouseEvent)=>{
        let dx = e.clientX - lastX;
        let dy = e.clientY - lastY;
        this.world.x += dx;
        this.world.y += dy;
        lastX = e.clientX;
        lastY = e.clientY;
        console.log(this.world.x);
      }

      let up = ()=>{
        app.canvas.removeEventListener('pointermove', move);
        app.canvas.removeEventListener('pointerup', up);
      }
      app.canvas.addEventListener('pointermove', move);
      app.canvas.addEventListener('pointerup', up);
    });

    this.world.addChild(background);

    app.stage.addChild(this.world);
  }
}
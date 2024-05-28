import { Container, Graphics, useApplication } from "solid-pixi";
import {Accessor, JSX, createContext, createEffect, createSignal, onCleanup, useContext} from 'solid-js'
import { Color, ContainerChild, Container as pxContainer} from "pixi.js";

const MIN_SCALE = 0.2;
const MAX_SCALE = 1.7;

export function Viewport(props : {
  children ?: JSX.Element,
}) {
  const worldWidth = 1000;
  const worldHeight = 1000;
  const [container, setContainer] = createSignal<pxContainer<ContainerChild>>();

  const app = useApplication();
  if(!app) throw new Error('Viewport must be a child of Application');

  const canvasPointerDownHandler = (e: PointerEvent)=>{
    const containerRef = container();
    if(!containerRef) return;

    let lastX = e.clientX;
    let lastY = e.clientY;

    let move = (e : MouseEvent)=>{
      let dx = e.clientX - lastX;
      let dy = e.clientY - lastY;
      containerRef.x += dx;
      containerRef.y += dy;
      lastX = e.clientX;
      lastY = e.clientY;
    }

    let up = ()=>{
      app.canvas.removeEventListener('pointermove', move);
      app.canvas.removeEventListener('pointerup', up);
    }
    app.canvas.addEventListener('pointermove', move);
    app.canvas.addEventListener('pointerup', up);
  }

  const canvasWheelHandler = (e : WheelEvent)=>{
    const containerRef = container();
    if(!containerRef) return;

    let targetScale = Math.max(
      MIN_SCALE, 
      Math.min(
        MAX_SCALE,
        containerRef.scale.x - e.deltaY * 0.01
      )
    );
    containerRef.scale.set(targetScale);
  }

  app.canvas.addEventListener('pointerdown', canvasPointerDownHandler);
  app.canvas.addEventListener('wheel', canvasWheelHandler);

  onCleanup(()=>{
    app.canvas.removeEventListener('pointerdown', canvasPointerDownHandler);
    app.canvas.removeEventListener('wheel', canvasWheelHandler);
  })
  return <Container
    x={app.screen.width / 2}  
    y={app.screen.height / 2}
    
    uses={setContainer}
  >
    {props.children}
  </Container>
}
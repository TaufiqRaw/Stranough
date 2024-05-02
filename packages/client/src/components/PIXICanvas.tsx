import { Application, Color, Graphics } from "pixi.js";
import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";

const MAX_WIDTH = 580;

export default function PIXICanvas (){
  const app = new Application();
  let canvasContainer : HTMLDivElement | undefined;
  const [isLoading, setIsLoading] = createSignal(true);

  const box = new Graphics()
          .rect(0, 0, 200, 100)
          .fill(0xffffff)

  onMount(() => {
    app
      .init({ background: '#E4E4E4', 
        width: window.innerWidth > MAX_WIDTH ? MAX_WIDTH : window.innerWidth, 
        height: window.innerHeight})
      .then(() => {
        setIsLoading(false);
        canvasContainer?.appendChild(app.canvas);
        app.stage.addChild(box);

        app.ticker.add(() => {
          box.tint = 0xff0000;
          box.x += 10;
          box.y = app.screen.height / 2 -50;
          if (box.x > app.screen.width) {
            box.x = 0-200;
          }
        });
      })

    const resizeListener = () => {
      const newWidth = window.innerWidth > MAX_WIDTH ? MAX_WIDTH : window.innerWidth;
      app.renderer.resize(newWidth, window.innerHeight);
    }
    window.addEventListener('resize', resizeListener);

    onCleanup(() => {
      window.removeEventListener('resize', resizeListener);
    });

  });

  return (
    <div ref={canvasContainer}>
    </div>
  );
}
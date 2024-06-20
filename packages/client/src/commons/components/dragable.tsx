import { JSX, children, onCleanup, onMount } from "solid-js";

interface BaseDragEvent {
  deltaX : number,
  deltaY : number,
  containerRef : HTMLDivElement,
}

interface DragEvent extends BaseDragEvent {
  forceStop : () => void
  resetDelta : () => void
}

interface DragExitEvent extends BaseDragEvent {}

export interface DragableController{
  startDragging : (x:number, y:number)=>void,
}

export default function Dragable(
  props : {
    children : JSX.Element,
    onEnter ?: () => void
    onExit ?: (e : DragExitEvent) => void
    onDrag ?: (e : DragEvent) => void,
    allowDrag : boolean,
    class ?: string,
    style ?: JSX.HTMLAttributes<HTMLDivElement>['style'],
    ref ?: HTMLDivElement | ((r : HTMLDivElement)=>void),
    controllerRef ?: (d : DragableController)=>void
  }
){
  let isDragging = false;
  let startX = 0, startY = 0;
  let deltaX = 0, deltaY = 0;

  function startDragging (x:number = 0, y:number = 0){
    deltaX = 0;
    deltaY = 0;
    startX = x;
    startY = y;
    props.onEnter && props.onEnter();
    isDragging = true;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  let targetRef : HTMLDivElement | undefined;
  let controller : DragableController = {
    startDragging : (x, y)=>{
      startDragging(x, y);
    }
  }

  props.controllerRef && props.controllerRef(controller);

  const resetDelta = (newStartX:number, newStartY:number)=>{
    deltaX = 0;
    deltaY = 0;
    startX = newStartX;
    startY = newStartY;
  }

  const onPointerDown = (e : PointerEvent)=>{
    if(!isDragging && props.allowDrag){
      startDragging(e.clientX, e.clientY);
    }
  }
  const onPointerUp = (e : PointerEvent)=>{
    if(isDragging){
      isDragging = false;
      props.onExit && props.onExit({deltaX, deltaY, containerRef : targetRef!});
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }
  }
  const onPointerMove = (e : PointerEvent)=>{
    deltaX = e.clientX - startX;
    deltaY = e.clientY - startY;
    const baseDragEventProp = {deltaX, deltaY, containerRef : targetRef!};
    if(isDragging){
      props.onDrag && props.onDrag({...baseDragEventProp, 
        forceStop : ()=>{onPointerUp(e)},
        resetDelta : ()=>{resetDelta(e.clientX, e.clientY)}
      });
    }
  }

  onMount(()=>{

    targetRef?.addEventListener('pointerdown', onPointerDown);
    onCleanup(()=>{
      targetRef?.removeEventListener('pointerdown', onPointerDown);
    });
  });
  
  return <div style={props.style} class={props.class} ref={(r)=>{typeof props.ref === "function" ?  props.ref(r) : props.ref = r; targetRef = r}}>
    {props.children}
  </div>
}
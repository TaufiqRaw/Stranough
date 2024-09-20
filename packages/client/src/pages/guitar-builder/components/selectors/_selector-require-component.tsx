import { GuitarBuilder } from "stranough-common";
import { useGuitarBuilderContext } from "../../guitar-builder"
import { JSX, Show } from "solid-js";
import { IGuitarBuilder } from "../../utils/types";

export function SelectorRequireComponent(
  props : {
    children : (ctx:NonNullable<ReturnType<typeof useGuitarBuilderContext>>)=>JSX.Element,
    requires : {
      message : string,
      test : (ctx : IGuitarBuilder)=>boolean,
    }[]
  }
){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return <Show
    when={
      props.requires.every(r=>r.test(guitarBuilderCtx))
    }
    fallback={
      <div>
        {props.requires.map(r=>{
          if(!r.test(guitarBuilderCtx)){
            return <div>{r.message}</div>
          }
          return null
        })}
      </div>
    }
  >
    {props.children(guitarBuilderCtx)}
  </Show>
}
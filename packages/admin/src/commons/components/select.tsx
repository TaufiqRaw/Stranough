import { JSX, Show, createEffect, createSignal, onCleanup, onMount, useContext } from "solid-js";
import { createContext } from "solid-js";

const SelectContext = createContext<{value ?: string, onClick: (value: {
  label : ()=>JSX.Element,
  value ?: string,
}) => void}>();

export function Select(props : {
  value ?: string,
  onChange: (value: string) => void,
  children: JSX.Element,
  class ?: string,
  placeholder ?: string,
}){
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [selectedValue, setSelectedValue] = createSignal(props.value);
  const [selectedLabel, setSelectedLabel] = createSignal<()=>JSX.Element>();
  let containerRef : HTMLDivElement | undefined = undefined;
  onMount(()=>{
    function handleClickOutside(event: MouseEvent){
      if(containerRef && !containerRef.contains(event.target as Node)){
        setIsExpanded(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    onCleanup(()=>{
      window.removeEventListener('click', handleClickOutside);
    })
  })

  return <SelectContext.Provider value={{
    value : props.value,
    onClick : ({label, value})=>{
      setIsExpanded(false);
      setSelectedLabel(()=>label);
      value && props.onChange(value);
    },
  }}>
    <div ref={containerRef} class={"relative border px-2 py-1 rounded-md " + (isExpanded() ? 'border-blue-500' : 'border-gray-500 hover:border-white-950')}>
      <div onClick={()=>setIsExpanded(p=>!p)}>  
        <Show when={selectedLabel()}>
          <div class="pointer-events-none">
            {selectedLabel()?.()}
          </div>
        </Show>
        <Show when={!selectedLabel()}>
          <div class="pointer-events-none">
            {props.placeholder ?? "Select an item..."}
          </div>
        </Show>
      </div>
      <div class={"flex flex-col absolute border-gray-300 border top top-full mt-2 left-0 min-w-full bg-gray-800 z-10 gap-1 " +props.class + " " + (isExpanded() ? "visible" : "hidden")}>
        {props.children}
      </div>
    </div>
  </SelectContext.Provider> 
}

export function Option(props : {
  value : string,
  class ?: string,
  activeClass ?: string,
  children : JSX.Element
}){
  const optionCtx = useContext(SelectContext)!;
  onMount(()=>{
    if(optionCtx.value === props.value){
      optionCtx.onClick({
        label : ()=>props.children,
      })
    }
  })

  return <div class={ props.class + " " + " px-2 py-1 " + " " +
    (optionCtx.value === props.value 
      ? (props.activeClass + " bg-blue-500")
      : "hover:bg-blue-400")
  } onClick={()=>optionCtx.onClick({
    label : ()=>props.children,
    value : props.value,
  })}>
    <div class="pointer-events-none">
      {props.children}
    </div>
  </div>
}
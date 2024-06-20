import { Show, createSignal, mergeProps } from "solid-js"

export function Range(_props : {
  onChange : (value : number) => void,
  value ?: number,
  min : number,
  max : number,
  step : number,
  parser? : (value : string) => number,
  class ?: string
}){
  const props = mergeProps({step: 0.01, min: 0, max: 1, value : 0, parser : parseFloat}, _props)
  const [showNumber, setShowNumber] = createSignal(false)
  return <div class={"flex flex-col gap-2 items-center " + props.class}>
    <input
      type="range"
      class="w-full"
      onClick={(e) => e.stopPropagation()}
      value={props.value}
      oninput={(e) => props.onChange(props.parser(e.target.value))}
      step={props.step}
      min={props.min}
      max={props.max}
    />
    <Show when={!showNumber()}>
      <i class="bi bi-chevron-down cursor-pointer -mt-3" onClick={() => setShowNumber(true)}></i>
    </Show>
    <Show when={showNumber()}>
      <input
        type="number"
        value={props.value}
        oninput={(e) => props.onChange(props.parser(e.target.value))}
        class="px-2 py-1 bg-transparent border border-gray-500 rounded-md w-full"
      />
      <i class="bi bi-chevron-up cursor-pointer -mt-2" onClick={() => setShowNumber(false)}></i>
    </Show>
  </div>
}
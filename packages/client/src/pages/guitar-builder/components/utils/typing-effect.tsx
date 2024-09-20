import { createSignal, onCleanup, onMount } from "solid-js";

export function TypingEffect(props : {
  text  : string;
}){
  const [index, setIndex] = createSignal(0);
  let interval : NodeJS.Timeout;

  onMount(()=>{
    interval = setInterval(()=>{
      const current = index();
      if(current < props.text.length){
        setIndex(current+1);
      } else {
        clearInterval(interval);
      }
    }, 18);

    onCleanup(()=>{
      clearInterval(interval);
    })
  })

  return <>
    {props.text.slice(0, index())}
  </>
}
import { getOwner } from "solid-js/web";
import { chatSocket } from "../utils/chat-socket";
import { createGuitarComponent } from "../utils/create-guitar-component";
import { For, Owner, Show, createEffect, createSignal } from "solid-js";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import { StepResponse } from "stranough-server/dist/interfaces/chatbot.interface";
import { useGuitarBuilderContext } from "../guitar-builder";

export function Chatbox(props : {
  
}){
  const guitarBuilderCtx = useGuitarBuilderContext()!;

  let chatboxContainer : HTMLDivElement | undefined;

  const [message, setMessage] = createSignal('' as string);

  createEffect(()=>{
    guitarBuilderCtx.socket.messages().length && chatboxContainer?.scrollTo({top : chatboxContainer.scrollHeight, behavior : 'smooth'});
  })

  return <div class="absolute right-0 w-80 h-screen p-3 z-10">
    <div class="h-full rounded-md bg-gray-700 shadow-xl flex flex-col text-gray-300">
      <div class="grow flex flex-col gap-2 overflow-y-auto" ref={chatboxContainer}>
        <For each={guitarBuilderCtx.socket.messages()}>
          { (message, index)=>(
              <div class={"chat " + (message.isUser ? 'self-end' : '')}>
                <div class={"p-2 rounded-lg " + (message.isUser ? 'bg-blue-500' : 'bg-gray-600')}>
                  <p>{message.data.message}</p>
                </div>
              </div>
            )
          }
        </For>
      </div>
      <div class="h-28 m-2 relative">
        <Textarea
          value={message()}
          onInput={e=>setMessage(e.target.value)}
          class="!bg-gray-600 !border-gray-800 w-full h-full resize-none"
        />
        <Show when={!guitarBuilderCtx.socket.isAnswering()}>
          <Button class="absolute right-2 bottom-2" onclick={()=>guitarBuilderCtx.socket.sendMessage(message())}>
            <i class="bi bi-send text-lg"></i>
          </Button>
        </Show>
      </div>
    </div>
  </div>
}
import { getOwner } from "solid-js/web";
import { chatSocket } from "../utils/chat-socket";
import { createGuitarComponent } from "../utils/create-guitar-component";
import { For, Owner, Show, createEffect, createSignal } from "solid-js";
import { Textarea } from "~/commons/components/textarea";
import { Button } from "~/commons/components/button";
import { StepResponse } from "stranough-server/dist/interfaces/chatbot.interface";
import { useSelectedGuitarComponent } from "../guitar-builder";

export function Chatbox(props : {
  
}){
  const {isAnswering, messages, selectComponent, sendMessage, status} = chatSocket({
    owner : getOwner() as Owner,
  })

  let chatboxContainer : HTMLDivElement | undefined;

  const [message, setMessage] = createSignal('' as string);

  createEffect(()=>{
    messages().length && chatboxContainer?.scrollTo({top : chatboxContainer.scrollHeight, behavior : 'smooth'});
  })

  return <div class="absolute right-0 w-80 h-screen pr-2 py-2 z-10">
    <div class="h-full rounded-md bg-gray-700 shadow-xl flex flex-col text-gray-300">
      <div class="grow flex flex-col gap-2 overflow-y-auto" ref={chatboxContainer}>
        <For each={messages()}>
          { (message, index)=>(
              <Show when={typeof message.data !== 'string'}
                fallback={
                  <div class={"mx-2 w-4/5 first:mt-2 " + (message.isUser ? 'self-end' : '')}>
                    <div class={"p-2 rounded-lg " + (message.isUser ? 'bg-blue-500' : 'bg-gray-600')}>
                      <p>{message.data as string}</p>
                    </div>
                  </div>
                }
              >
                <ChoiceMessage message={message} selectComponent={selectComponent}/>
              </Show>
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
        <Show when={!isAnswering()}>
          <Button class="absolute right-2 bottom-2" onclick={()=>sendMessage(message())}>
            <i class="bi bi-send text-lg"></i>
          </Button>
        </Show>
      </div>
    </div>
  </div>
}

function ChoiceMessage(props : {
  message : { data: string | Omit<StepResponse, "itemAsMessage">; isUser: boolean; },
  selectComponent : (id : number)=>void,
}){
  const [selectedId, setSelectedId] = createSignal<number>(); 
  createEffect(()=>{
    console.log(selectedId());
  })
  return <div class="mx-2 first:mt-2">
  <div class="bg-gray-600 p-2 rounded-lg">
    <p class="text-sm text-center mb-2">{(props.message.data as StepResponse).message}</p>
    <div class="flex flex-col gap-2">
      <For each={(props.message.data as StepResponse).items}>
        { (choice, i)=><Show when={typeof choice !== 'string'}
          fallback={
            <Button onClick={()=>{if(selectedId() !== undefined)return; setSelectedId(i()) ;props.selectComponent(i())}} class={(selectedId() == i() ? "" : "border border-gray-300 !bg-transparent hover:border-gray-50")}>{choice}</Button>
          }
        >
          <Button onClick={()=>{if(selectedId() !== undefined)return; setSelectedId(choice.id); props.selectComponent(choice.id)}} class={(selectedId() == choice.id ? "" : "border border-gray-300 !bg-transparent hover:border-gray-50")}>{choice.name}</Button>
        </Show>
        }
      </For>
    </div>
    <p class="text-xs text-center mt-2 text-gray-400">Menampilakan {(props.message.data as StepResponse).items.length} dari {(props.message.data as StepResponse).total} total item</p>
  </div>
</div>
}
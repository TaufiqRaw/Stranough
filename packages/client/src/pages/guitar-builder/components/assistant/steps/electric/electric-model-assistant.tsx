import { createQuery } from "@tanstack/solid-query"
import { Accessor, For, Owner, Show, Suspense, batch, createEffect, createMemo, createSignal, getOwner, onCleanup, onMount, useContext } from "solid-js";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository"
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { ImageButton } from "../../../utils/image-button";
import { priceFormat } from "~/commons/functions/price-format";
import { IGuitarBuilder } from "~/pages/guitar-builder/utils/types";
import { ItemSelectorType, itemSelectorContainerCtx } from "../../../utils/item-selector";
import { AssistantSelector } from "../../utils/assistant-selector";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { useAssistant } from "../../_assistant";
import { WhereToClickAssist } from "../../utils/where-to-click-assist";
import { TypingEffect } from "../../../utils/typing-effect";

export function ElectricModelAssistant(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const electricModels = createQuery(()=>({
    queryKey : electricModelRepository.queryKey({
      limit : 100,
      page : 1,
      isBass : guitarBuilderCtx.guitarType.get()! === 'electric-bass'
    }),
    queryFn : async ()=>await electricModelRepository.index(1, {
      limit : 100,
      deep : true,
    })
  }))
  const items = createMemo(()=>electricModels.data?.map((model)=>{
    return {
      key : model.id,
      name : model.name,
      price : model.price,
      //@ts-ignore
      thumbnailSrc : serverImgUrl(model.thumbnail?.filename, true)
    }
  }))
  return <AssistantSelector
    title="Pilih bentuk dasar gitar"
    componentKey="guitarModel"
    itemSelector={()=><ModelSelector
      items={()=>items}
      onClick={async(model, o, ctx)=>{
        const modelData = await electricModelRepository.get(model.key as number, {
          owner : o,
        })
        ctx?.electric.guitarModel.set(modelData);
        ctx?.electric.constructionMethod.set(modelData?.selectedConstruction.get() ?? undefined);
        ctx?.electric.topContour.set(modelData?.selectedTopContour.get() ?? undefined);
        ctx?.electric.backContour.set(modelData?.selectedBackContour.get() ?? undefined);
      }}
      selected={(model, ctx)=>{
        return model.key === ctx?.electric.guitarModel.get()?.id.get()
      }}
      hasSelected={(ctx)=>ctx.electric.guitarModel.get() !== undefined}
    />}
  />
}

function ModelSelector<O, T extends ItemSelectorType<O>>(props : {
  items : ()=>()=>T[] | undefined,
  selected : (item : T, ctx : IGuitarBuilder)=>boolean,
  onClick : (item : T, owner : Owner, ctx : IGuitarBuilder)=>Promise<void> | void,
  hasSelected : (ctx : IGuitarBuilder)=>boolean,
}){
  const items = props.items();
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const containerCtx = useContext(itemSelectorContainerCtx);
  const {setSpotlightNextBtn} = useAssistant()!;
  const [clicked, setClicked] = createSignal(false);
  const owner = getOwner();

  function onClick(item : T){
    props.onClick(item, owner!, guitarBuilderCtx);
    containerCtx?.onClick(item, owner!, guitarBuilderCtx);
  }

  onMount(()=>{
    guitarBuilderCtx.setAssistMsg({
      message : "Pilih salah satu bentuk dari <b>daftar rekomendasi</b> atau dari <b>daftar item</b> di bawah"
    })
  })

  createEffect(()=>{
    if(props.hasSelected(guitarBuilderCtx)){
      batch(()=>{
        guitarBuilderCtx.setAssistMsg({
          message : "Klik tombol <b>Lanjut</b> untuk melanjutkan",
        });
        setSpotlightNextBtn(true);
      })
    }
  })

  onCleanup(()=>{
    guitarBuilderCtx.clearAssistMsg();
  })

  return <div class="flex flex-col gap-2">
  <Suspense>
    <Recommendation
      clicked={clicked}
      items={items}
      onClick={onClick}
      selected={props.selected}
      setClicked={setClicked}
      hasSelected={props.hasSelected}
    />
  </Suspense>

  <WhereToClickAssist
    active={!props.hasSelected(guitarBuilderCtx)}
    onClick={()=>{}}
  >
    <div class="grid gap-2 lg:grid-cols-2 grid-cols-3 w-full">

    {/* items */}
    <For each={items()}>
      {(item)=> 
        <ImageButton
          isActive={props.selected(item, guitarBuilderCtx)}
          onClick={()=>onClick(item)}
          src={item.thumbnailSrc}
          title={item.name}
          priceTag={(item.price && item.price > 0) ? `+Rp ${priceFormat(item.price)}` : undefined}
        />
      }
    </For>
    </div>
  </WhereToClickAssist>
</div>
}

function Recommendation<O, T extends ItemSelectorType<O>>(
  props : {
    hasSelected : (ctx : IGuitarBuilder)=>boolean,
    clicked : Accessor<boolean>,
    setClicked : (val : boolean)=>void,
    selected : (item : T, ctx : IGuitarBuilder)=>boolean,
    onClick : (item : T)=>void,
    items : ()=>T[] | undefined,
  }
){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const containerCtx = useContext(itemSelectorContainerCtx);
  let recommendationContainerDiv : HTMLDivElement | undefined;

  const recommendationMap = createMemo(()=>containerCtx?.recommendedItems?.()?.reduce((acc, curr)=>({...acc, [typeof curr === 'boolean' ? (curr ? 'yes' : 'no') : curr] : true}), {} as Record<string|number, boolean>));

  return <div class="border-t border-b border-gray-600 my-2 -mx-2 w-[calc(100%+1rem)]">
    <Show when={containerCtx?.recommendedItems?.() 
    // && containerCtx?.recommendedItems?.()!.length > 0
    }
      fallback={<div class="px-2 py-4 text-gray-400 text-center">
        Pilih dari daftar item di bawah
      </div>}
    >
      <div class="p-2 flex flex-col gap-2">
        <span class="font-bold flex items-center gap-2 text-yellow-500">
          <i class="bi bi-star text-lg"/>
          <span>Rekomendasi</span>
        </span>
        <div class="border border-yellow-500 rounded-md p-2 text-yellow-500">
          <Show when={containerCtx?.recommendationMsg?.()}>
            <TypingEffect text={
              containerCtx?.recommendationMsg?.()!
            }/>
          </Show>
        </div>
        <WhereToClickAssist
          active={!props.hasSelected(guitarBuilderCtx)}
          onClick={()=>{}}
        >
          <div ref={recommendationContainerDiv} class="grid gap-2 lg:grid-cols-2 grid-cols-3">
          {/* Actual recommended components */}
          <For each={props.items()}>
            {(item)=> recommendationMap()?.[item.key+''] 
              ? <ImageButton
                isActive={props.selected(item, guitarBuilderCtx)}
                onClick={()=>props.onClick(item)}
                src={item.thumbnailSrc}
                title={item.name}
                children={item.imgBtnChild}
                priceTag={(item.price && item.price > 0) ? `+Rp ${priceFormat(item.price)}` : undefined}
              /> 
              : null
            }
            </For>
          </div>
        </WhereToClickAssist>
      </div>
      <div class="border-t border-gray-600 px-2 py-4 text-gray-400 text-center">
        Atau pilih dari daftar item di bawah
      </div>
    </Show>
  </div>
}
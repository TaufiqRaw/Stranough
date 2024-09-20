import { Accessor, For, JSX, Owner, Show, Suspense, createContext, createEffect, createMemo, createSignal, getOwner, useContext } from "solid-js";
import { ImageButton } from "./image-button";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { IGuitarBuilder } from "../../utils/types";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Portal } from "solid-js/web";
import { Caption } from "../assistant/utils/caption";
import { priceFormat } from "~/commons/functions/price-format";
import { TypingEffect } from "./typing-effect";

export type ItemSelectorType<O> = {
  thumbnailSrc ?: string,
  name : string,
  value ?: O,
  key : string | number,
  imgBtnChild ?: ()=>JSX.Element,
  price ?: number,
};

export const itemSelectorContainerCtx = createContext<{
  onClick : (item : {
    thumbnailSrc ?: string,
    name : string,
    key : string | number,
    price ?: number,
  } | undefined, owner : Owner, ctx : IGuitarBuilder)=>Promise<void> | void,
  recommendationMsg ?: ()=>string | undefined,
  recommendedItems ?: ()=>(string|number|boolean)[] | undefined,
}>();

// if item nullable it must have onClear function and hasSelected prop, hasSelected is used to determine if there is a selected item
export function ItemSelector<O, T extends ItemSelectorType<O>>(props : {
  items : ()=>()=>T[] | undefined,
  selected : (item : T, ctx : IGuitarBuilder)=>boolean,
  onClick : (item : T, owner : Owner, ctx : IGuitarBuilder)=>Promise<void> | void,
  type : 'image' | 'text',
  nullable ?: boolean,
  hasSelected ?: (ctx : IGuitarBuilder)=>boolean,
  onClear ?: (ctx : IGuitarBuilder)=>void,
}){
  const items = props.items();
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const containerCtx = useContext(itemSelectorContainerCtx);
  const [clicked, setClicked] = createSignal(false);

  function onClick(item : T){
    props.onClick(item, getOwner()!, guitarBuilderCtx);
    containerCtx?.onClick(item, getOwner()!, guitarBuilderCtx);
  }

  function onClear(){
    props.onClear!(guitarBuilderCtx);
    containerCtx?.onClick(undefined, getOwner()!, guitarBuilderCtx);
    setClicked(true);
  }

  return<div class="flex flex-col gap-2">
    <Suspense>
      <Recommendation
        clicked={clicked}
        items={items}
        onClick={onClick}
        selected={props.selected}
        type={props.type}
        nullable={props.nullable}
        setClicked={setClicked}
        hasSelected={props.hasSelected}
        onClear={onClear}
      />
    </Suspense>

    <div class={"grid gap-2 " + (props.type === 'image' ? "lg:grid-cols-2 grid-cols-3" : "")}>
    {/* button to clear selection */}
    <Show when={props.nullable === true && typeof props.hasSelected !== 'undefined' && props.onClear}>
      {props.type === 'image' ? <ImageButton
        isActive={!props.hasSelected?.(guitarBuilderCtx) && clicked()}
        onClick={() => {
          onClear();
          setClicked(true);
        }}
        icon={() => <i class="bi bi-ban text-5xl" />}
        title="Tidak perlu"
      /> : <ToggleableButton
        isActive={!props.hasSelected?.(guitarBuilderCtx) && clicked()}
        onClick={()=>{
          onClear();
          setClicked(true);
        }}
      >Tidak Perlu</ToggleableButton>}
    </Show>

    {/* items */}
    <For each={items()}>
      {(item)=> 
        props.type === 'image' ? <ImageButton
          isActive={props.selected(item, guitarBuilderCtx)}
          onClick={()=>onClick(item)}
          src={item.thumbnailSrc}
          title={item.name}
          children={item.imgBtnChild}
          priceTag={(item.price && item.price > 0) ? `+Rp ${priceFormat(item.price)}` : undefined}
        /> : <ToggleableButton
        isActive={props.selected(item, guitarBuilderCtx)}
        onClick={()=>onClick(item)}
      >
        {(isActive)=><Show 
          when={item.price}
          fallback={item.name}
        >
          <div class="flex flex-col gap-1">
            <span>{item.name}</span>
            <span class={"text-sm " + (isActive ? 'text-gray-200' : 'text-gray-400')}>+Rp {priceFormat(item.price!)}</span>
          </div>
        </Show>}
      </ToggleableButton>
      }
    </For>
    </div>
  </div>
}

function Recommendation<O, T extends ItemSelectorType<O>>(
  props : {
    type ?: 'image' | 'text',
    nullable ?: boolean,
    hasSelected ?: (ctx : IGuitarBuilder)=>boolean,
    onClear ?: ()=>void,
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
        <div ref={recommendationContainerDiv} class={"grid gap-2 " + (props.type === 'image' ? "lg:grid-cols-2 grid-cols-3" : "")}>
        {/* Clear button when item nullable */}
        <Show when={containerCtx?.recommendedItems?.()?.some((item)=>item === 'none') && !!props.onClear && props.nullable}>
          {props.type === 'image' ? <ImageButton
            isActive={!props.hasSelected?.(guitarBuilderCtx) && props.clicked()}
            onClick={() => {
              props.onClear?.();
              props.setClicked(true);
            }}
            icon={() => <i class="bi bi-ban text-5xl" />}
            title="Tidak perlu"
          /> : <ToggleableButton
            isActive={!props.hasSelected?.(guitarBuilderCtx) && props.clicked()}
            onClick={()=>{
              props.onClear?.();
              props.setClicked(true);
          }}
          >Tidak Perlu</ToggleableButton>  
          }
        </Show>
        {/* Actual recommended components */}
        <For each={props.items()}>
          {(item)=> recommendationMap()?.[item.key+''] ?
              (props.type === 'image' ? <ImageButton
              isActive={props.selected(item, guitarBuilderCtx)}
              onClick={()=>props.onClick(item)}
              src={item.thumbnailSrc}
              title={item.name}
              children={item.imgBtnChild}
              priceTag={(item.price && item.price > 0) ? `+Rp ${priceFormat(item.price)}` : undefined}
            /> 
            : <ToggleableButton
              isActive={props.selected(item, guitarBuilderCtx)}
              onClick={()=>props.onClick(item)}>
                {(isActive)=><Show 
                  when={item.price}
                  fallback={item.name}
                >
                  <div class="flex flex-col gap-1">
                    <span>{item.name}</span>
                    <span class={"text-sm " + (isActive ? 'text-gray-200' : 'text-gray-400')}>+Rp {priceFormat(item.price!)}</span>
                  </div>
                </Show>}
              </ToggleableButton>) : null
          }
          </For>
        </div>
      </div>
      <div class="border-t border-gray-600 px-2 py-4 text-gray-400 text-center">
        Atau pilih dari daftar item di bawah
      </div>
    </Show>
  </div>
}
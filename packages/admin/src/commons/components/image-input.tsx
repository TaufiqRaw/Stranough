import { createMutation } from "@tanstack/solid-query";
import {axios} from "~/commons/axios-instance";
import { Texture } from "pixi.js";
import { JSX, Show, createSignal, mergeProps, onMount } from "solid-js";
import { GuitarPartEnumType, ServerDtos, ServerEntities } from "stranough-server";
import { Constants } from "~/constants";
import { Input } from "~/commons/components/input";
import { ImageType } from "~/commons/interfaces/image-type";

export default function (_props: {
  partType : GuitarPartEnumType;
  onLoad: (image: ImageType) => void;
  onError ?: (error: ErrorEvent) => void;
  onRemove: () => void;
  imageFilename?: string;
  label ?: string | JSX.Element;
}) {
  const props = mergeProps({ onError : (err : Error)=>{console.log(err)}}, _props)
  const [isExpanded, setIsExpanded] = createSignal(false);
  let fileInput: HTMLInputElement | undefined;

  const imageMutator = createMutation<ServerEntities.Media, any>(()=>({
    mutationFn : async () =>{
      if(!fileInput || !fileInput.files || fileInput.files?.length === 0) 
        throw new Error("No file selected");
      const res = await axios.postForm<ServerEntities.Media>(`${Constants.serverUrl}/medias/${props.partType}`, {
        file: fileInput.files[0],
        name : props.partType
      });
      const selectedImage = new Image();
      selectedImage.src = `${Constants.serverImgUrl}/${res.data.filename}`;
      props.onLoad({
        id : res.data.id,
        filename : res.data.filename,
      });
      return res.data;
    },
    onError : props.onError
  }))
  
  onMount(() => {
    fileInput!.addEventListener(
      "change",
      async (e)=>{
        imageMutator.mutate()
      }
    );
  });

  function onRemove() {
    props.onRemove();
  }

  return (
    <div class="flex flex-col gap-2 relative overflow-hidden">
      <div class="flex gap-2 -mt-1 items-center cursor-pointer" onClick={()=>setIsExpanded(!isExpanded())}>
        <div class="grow text-sm">
          {props.label}
        </div>
        {/* <div class={"w-2 h-2 rounded-full " + (props.imageFilename ? 'bg-blue-500' : '')} /> */}
        <Show when={props.imageFilename}>
          <i class={"bi " + (isExpanded() ? 'bi-chevron-up' : 'bi-chevron-down')}></i>
        </Show>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/png"
        class="invisible absolute"
        width={0}
      />
      <Show when={!props.imageFilename}>
        <button
          onClick={()=>fileInput!.click()}
          class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950"
        >
          Choose Image
        </button>
      </Show>
      <Show when={isExpanded()}>
        <Show
          when={!!props.imageFilename }
        >
          <div class="flex flex-col gap-2">
            <div class="p-2 bg-gray-700 rounded-md border border-gray-500">
              <img
                src={`${Constants.serverImgUrl}/${props.imageFilename}`}
                class="w-full object-cover"/>
            </div>
            <button
              onClick={()=>onRemove()}
              class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950"
            >
              Remove Image
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}

import { createMutation } from "@tanstack/solid-query";
import {axios} from "~/commons/axios-instance";
import { Texture } from "pixi.js";
import { Show, createSignal, onMount } from "solid-js";
import { GuitarPartEnumType, ServerDtos, ServerEntities } from "stranough-server";
import { Constants } from "~/constants";
import { Input } from "~/commons/components/input";
import { ImageType } from "~/commons/interfaces/image-type";

export default function (props: {
  partType : GuitarPartEnumType;
  onLoad: (image: ImageType) => void;
  onError: (error: ErrorEvent) => void;
  onRemove: () => void;
  imageFilename?: string;
}) {
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
      <input
        ref={fileInput}
        type="file"
        accept="image/png"
        class="invisible absolute"
        width={0}
      />
      <Show
        when={!!props.imageFilename}
        fallback={
          <button
            onClick={()=>fileInput!.click()}
            class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950"
          >
            Choose Image
          </button>
        }
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
    </div>
  );
}

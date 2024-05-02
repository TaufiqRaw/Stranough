import { Show, createSignal, onMount } from "solid-js";
import { loadImageFromInput } from "~/utils/functions/loadImageFromInput";

export default function (props: {
  onLoad: (image: HTMLImageElement) => void;
  onError: (error: ErrorEvent) => void;
  onRemove: () => void;
}) {
  let fileInput: HTMLInputElement | undefined;
  let [selectedImage, setSelectedImage] = createSignal<HTMLImageElement>();
  onMount(() => {
    fileInput!.addEventListener(
      "change",
      loadImageFromInput({
        onLoad: (img) => {
          props.onLoad(img);
          setSelectedImage(img);
        },
        onError: props.onError,
      })
    );
  });

  function onRemove() {
    props.onRemove();
    setSelectedImage(undefined);
  }

  return (
    <div>
      <input
        ref={fileInput}
        type="file"
        accept="image/png"
        class="invisible absolute"
      />
      <Show
        when={selectedImage()}
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
          <div class="p-2 bg-white rounded-md">
            <img
              src={selectedImage()!.src}
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

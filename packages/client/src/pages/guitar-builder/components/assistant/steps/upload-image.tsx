import { Show, createMemo, createSignal } from "solid-js";
import { useAssistant } from "../_assistant";
import { Constants } from "~/constants";
import { Caption } from "../utils/caption";
import { assistantStepKeys, assistantStepKeysType } from "../assistant-steps";
import { typeToNextStep } from "../utils/constants";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { axios } from "~/commons/axios-instance";
import { ServerEntities } from "stranough-server";

export function UploadImage(){
  const {nextStepCandidate, setOnNextButtonClick, assistantSocket} = useAssistant();
  const selected = useGuitarBuilderContext()!;

  const nextStep = createMemo(()=>{
    return typeToNextStep[selected.guitarType.get()!];
  })
  const [imageSrc, _setImageSrc] = createSignal<string>();
  let fileInput: HTMLInputElement | undefined;
  const setImageSrc = (src: string) => {
    _setImageSrc(src)
    nextStepCandidate.set(nextStep())
  }
  setOnNextButtonClick((()=>async()=>{
    if(!fileInput?.files?.[0]){
      throw new Error('Pilih gambar terlebih dahulu');
    }
    if(assistantSocket.id() === undefined){
      throw new Error('Tidak bisa mengunggah gambar');
    }

    const res = await axios.postForm<ServerEntities.Media>(`${Constants.serverUrl}/medias/user-preference`, {
      file: fileInput!.files![0],
      name : assistantSocket.id(),
    });

    const imageStatus = await assistantSocket.uploadImage();
    if(!imageStatus){
      throw new Error('Gagal mengunggah gambar, coba lagi, pastikan gambar memuat gitar dengan jelas');
    }
  }))
  return <>
    <Caption>
      <div class="gap-2 flex flex-col">
        <div class="grid items-center">
          Pilih gambar referensi gitar yang ingin kamu buat, pastikan gambar gitar terlihat jelas seperti contoh di bawah
        </div>
        <div class="grid grid-cols-3 gap-2">
          <img src="/assets/example-1.png" class="rounded-md" alt="example-1" />
          <img src="/assets/example-2.png" class="rounded-md col-span-2" alt="example-2" />
        </div>
      </div>
    </Caption>
    <input
      ref={fileInput}
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      class="invisible absolute"
      width={0}
      onChange={(e)=>{
        const files = fileInput!.files
        const file = files?.item(0)
        if(file) {
          setImageSrc(URL.createObjectURL(file))
        }
      }}
    />
    <Show when={!imageSrc()}>
      <button
        onClick={()=>fileInput!.click()}
        class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950"
      >
        Pilih Gambar
      </button>
    </Show>
    <Show
      when={!!imageSrc()}
    >
      <div class="flex flex-col gap-2">
        <button
          onClick={()=>fileInput!.click()}
          class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950"
        >
          Ubah Gambar
        </button>
        <div class="p-2 bg-gray-700 rounded-md border border-gray-500">
          <img
            src={imageSrc()}
            class="w-full object-cover"/>
        </div>
      </div>
    </Show>
  </>
}
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { useAssistant } from "../_assistant";
import { assistantStepKeys } from "../assistant-steps";
import { Button } from "../utils/button";
import { CaptionedToggleableButton } from "../utils/captioned-toggleable-button";
import { Header } from "../utils/header";
import { For, Show, batch, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { WhereToClickAssist } from "../utils/where-to-click-assist";
import { on } from "solid-js";
import { Caption } from "../utils/caption";
import { Textarea } from "~/commons/components/textarea";
import { typeToNextStep } from "../utils/constants";
import axios from "axios";
import { ServerEntities } from "stranough-server";
import { Constants } from "~/constants";

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 250;
export function AssistMode(){
  const {nextStepCandidate, setOnNextButtonClick, assistantSocket, setSpotlightNextBtn} = useAssistant();
  const {setAssistMsg, clearAssistMsg} = useGuitarBuilderContext()!;
  const [guitarDescription, setGuitarDescription] = createSignal('');
  const selected = useGuitarBuilderContext()!;
  const [assistStep, setAssistStep] = createSignal(0);
  let descriptionRef : HTMLTextAreaElement | undefined; 

  const nextStep = createMemo(()=>{
    return typeToNextStep[selected.guitarType.get()!];
  })

  const [imageSrc, _setImageSrc] = createSignal<string[]>();

  let fileInput: HTMLInputElement | undefined;
  const setImageSrc = (src: string[]) => {
    _setImageSrc(src)
    nextStepCandidate.set(nextStep())
  }

  function descriptionChange(e : Event){
    const target = (e.target as HTMLTextAreaElement)
    const newDescription = target.value.replaceAll('\n', '');
    target.value = newDescription.slice(0, MAX_DESCRIPTION_LENGTH);
    if(newDescription.length > MIN_DESCRIPTION_LENGTH)
      nextStepCandidate.set(nextStep());
    else nextStepCandidate.set(undefined);
    if(newDescription.length > MAX_DESCRIPTION_LENGTH){
      return setGuitarDescription(newDescription.slice(0, MAX_DESCRIPTION_LENGTH));
    }
    return setGuitarDescription(newDescription);
  }

  setOnNextButtonClick(_=>async()=>{
    if(guitarDescription().length < MIN_DESCRIPTION_LENGTH + 1) throw new Error('Description too short');
    if(assistantSocket.id() === undefined){
      throw new Error('Tidak bisa mengunggah gambar');
    }
    
    if((fileInput?.files?.length ?? 0) > 0){
      const formData = new FormData();
      formData.append('name', assistantSocket.id() + "")
      for(let i = 0; i < fileInput!.files!.length; i++){
        formData.append('files', fileInput!.files![i]);
      }
      await axios.postForm<ServerEntities.Media>(`${Constants.serverUrl}/medias/user-preference`, formData);

      const res = await assistantSocket.uploadPref(guitarDescription(), fileInput!.files!.length);
    }
    else{
      const res = await assistantSocket.uploadPref(guitarDescription());
    }
    
  })

  createEffect(()=>{
    switch(assistStep()){
      case 0 : {
        setAssistMsg({
          message: "Deskripsikan gitar yang ingin kamu buat disini.",
        })
        break;
      }
      case 1 : {
        if(guitarDescription().length < MIN_DESCRIPTION_LENGTH + 1) {
          setAssistMsg({
            message: "Tuliskan setidaknya lebih dari 20 karakter untuk melanjutkan.",
          });
          return;
        }else{
          batch(()=>{
          if(!imageSrc())
            setAssistMsg({
              message: "<ol> <li> anda dapat mengunggah gambar referensi gitar yang ingin kamu buat </li> <li> atau Klik tombol 'Lanjut' untuk melanjutkan ke langkah berikutnya.</li></ol>",
            });
          else
            setAssistMsg({
              message: "Klik tombol 'Lanjut' untuk melanjutkan ke langkah berikutnya.",
            });
          setSpotlightNextBtn(true);
          })
          break;
        }
      }
    }
  })

  onCleanup(()=>clearAssistMsg());
  return <>
    <div class="flex flex-col">
      <WhereToClickAssist
        active={assistStep() === 0}
        onClick={()=>{
          setAssistStep(1)
          descriptionRef?.focus();
        }}
      >
        <Textarea class="!bg-transparent border-white h-52 resize-none w-full" ref={descriptionRef} placeholder="Tulis deskripsi gitar seperti jenis musik yang ingin dimainkan, harga gitar, spesifikasi gitar, atau hal lain yang ingin anda sertakan." onInput={descriptionChange} value={guitarDescription()}/>
      </WhereToClickAssist>
      <div class="text-gray-400 self-end">
        {guitarDescription().length}/{MAX_DESCRIPTION_LENGTH}
      </div>
    </div>
    <Caption>
      <div class="gap-2 flex flex-col">
        <div class="grid items-center">
          Jika ada, anda dapat menambah 5 referensi gambar gitar yang ingin anda buat.
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
      multiple={true}
      accept="image/png, image/jpeg, image/jpg"
      class="invisible absolute"
      width={0}
      onChange={(e)=>{
        const files = fileInput!.files
        if((files?.length ?? 0) > 0){
          for(let i = 0; i < files!.length; i++){
            const file = files![i];
            const res = [] as string[];
            if(file.size > 1024 * 1024 * 5){
              alert('Ukuran gambar terlalu besar, maksimal 5MB');
              return;
            }
            for(let i = 0; i < files!.length; i++){
              res.push(URL.createObjectURL(files![i]));
            };
            setImageSrc(res);
          }
        }
      }}
    />
    <Show when={!imageSrc()}>
      <WhereToClickAssist active={
        !imageSrc() && guitarDescription().length > MIN_DESCRIPTION_LENGTH + 1
      } onClick={(e)=>{
        e.stopPropagation();
        fileInput!.click()
      }}>
        <button
          // onclick={()=>fileInput!.click}
          class="px-2 py-1 border border-gray-500 rounded-md hover:border-white-950 w-full"
        >
          Pilih Gambar
        </button>
      </WhereToClickAssist>
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
        <div class="p-2 bg-gray-700 rounded-md border border-gray-500 grid grid-cols-2 gap-2">
          <For each={imageSrc()}>
            {(src)=>(
              <img src={src} class="w-full object-cover"/>
            )}
          </For>
        </div>
      </div>
    </Show>
  </>
}
import { Textarea } from "~/commons/components/textarea";
import { Header } from "../utils/header";
import { Show, createMemo, createSignal } from "solid-js";
import { useAssistant } from "../_assistant";
import { Caption } from "../utils/caption";
import { assistantStepKeysType } from "../assistant-steps";
import { typeToNextStep } from "../utils/constants";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 250;

export function DescribeGuitar(){
  const {nextStepCandidate, setOnNextButtonClick, assistantSocket} = useAssistant();
  const [guitarDescription, setGuitarDescription] = createSignal('');
  const selected = useGuitarBuilderContext()!;

  const nextStep = createMemo(()=>{
    return typeToNextStep[selected.guitarType.get()!];
  })

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
    const res = await assistantSocket.describeGuitar(guitarDescription());
    if(!res) throw new Error('Deskripsi gitar tidak valid, silahkan coba lagi.');
  })
  
  return <>
    <div class="flex flex-col">
      <Textarea class="!bg-transparent border-white h-52 resize-none" placeholder="Deskripsikan gitar yang ingin kamu buat disini." onInput={descriptionChange} value={guitarDescription()}/>
      <div class="text-gray-400 self-end">
        {guitarDescription().length}/{MAX_DESCRIPTION_LENGTH}
      </div>
    </div>
    <Show when={guitarDescription().length > 0 && guitarDescription().length < (MIN_DESCRIPTION_LENGTH + 1)}>
      <Caption type="warning">
        Tuliskan setidaknya lebih dari 20 karakter untuk melanjutkan.
      </Caption>
    </Show>
    <Caption>
      Anda dapat mendeskripsikan gitar seperti jenis musik yang ingin dimainkan, harga gitar, spesifikasi gitar, atau hal lain yang ingin anda sertakan.
    </Caption>
  </>
}
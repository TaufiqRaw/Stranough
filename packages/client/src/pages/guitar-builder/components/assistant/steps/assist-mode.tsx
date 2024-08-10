import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { useAssistant } from "../_assistant";
import { assistantStepKeys } from "../assistant-steps";
import { Button } from "../utils/button";
import { CaptionedToggleableButton } from "../utils/captioned-toggleable-button";
import { Header } from "../utils/header";

export function AssistMode(){
  const {nextStepCandidate} = useAssistant()!;
  return <>
    <Header>
      Pilih cara membuat gitar
    </Header>
    <CaptionedToggleableButton
      title="Mendeskripsikan Gitar"
      caption="Deskripsikan gitar yang anda inginkan, kami akan membantu anda memilih komponen yang sesuai dengan deskripsi yang anda berikan"
      isActive={nextStepCandidate.get() === assistantStepKeys.describeGuitar}
      onClick={()=>nextStepCandidate.set(assistantStepKeys.describeGuitar)}
    />
    <CaptionedToggleableButton
      title="Menggunakan Gambar Referensi"
      caption="Upload gambar gitar sebagai referensi, kami akan membantu anda memilih komponen yang sesuai dengan gambar yang anda upload"
      isActive={nextStepCandidate.get() === assistantStepKeys.uploadImage}
      onClick={()=>nextStepCandidate.set(assistantStepKeys.uploadImage)}
    />
  </>
}
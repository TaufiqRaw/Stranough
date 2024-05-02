import MainCanvas from "~/components/MainCanvas";
import UserGui from "~/components/UserGui/UserGui";
import { GuitarBodyStateProvider } from "~/contexts/GuitarConfigContext";

export default function BodyEditor() {
  return <GuitarBodyStateProvider>
    <div class="relative flex">
      <UserGui/>
      <MainCanvas/>
    </div>
  </GuitarBodyStateProvider>
}
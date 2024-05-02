import { Accessor, Component, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import "./app.css";
import PIXICanvas from "./components/PIXICanvas";
import UserGUI from "./components/UserGUI";
import 'simplebar/dist/simplebar.css';
import 'swiper/css';
import 'swiper/css/navigation';

export default function App() {
  return (
    <div class="flex justify-center">
      <div class="relative max-w-[580px]">
        <PIXICanvas></PIXICanvas>
        <UserGUI></UserGUI>
      </div>
    </div>
  );
}

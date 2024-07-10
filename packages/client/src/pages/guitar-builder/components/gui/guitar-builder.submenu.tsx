import { JSX, Show } from "solid-js";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { useGuitarBuilderMenuContext } from "./guitar-builder-gui";

export function GuitarBuilderSubmenu(props: {
  children: JSX.Element;
  mustHaveModel?: boolean;
  mustHaveHeadstock?: boolean;
  mustHavePickupConfiguration?: boolean;
}) {
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const guitarBuilderMenuCtx = useGuitarBuilderMenuContext()!;
  if (props.mustHaveModel && !guitarBuilderCtx.guitarModel.get()) {
    return (
      <div class="flex flex-col text-white-950 px-2 gap-3 h-full">
        <div class="h-full flex items-center justify-center">
          <p class="text-gray-400 text-center">
            Pilih{" "}
            <span
              class="text-blue-500 cursor-pointer"
              onClick={() =>{
                guitarBuilderMenuCtx
                  .setSelectedSubmenu('Model')
              }}
            >
              model gitar
            </span>{" "}
            terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  if(props.mustHaveHeadstock && !guitarBuilderCtx.headstock.get()){
    return (
      <div class="flex flex-col text-white-950 px-2 gap-3 h-full">
        <div class="h-full flex items-center justify-center">
          <p class="text-gray-400 text-center">
            Pilih{" "}
            <span
              class="text-blue-500 cursor-pointer"
              onClick={() =>{
                guitarBuilderMenuCtx
                  .setSelectedSubmenu('Jenis Headstock')
              }}
            >
              jenis headstock
            </span>{" "}
            terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  if(props.mustHavePickupConfiguration && !guitarBuilderCtx.pickupConfiguration.get()){
    return (
      <div class="flex flex-col text-white-950 px-2 gap-3 h-full">
        <div class="h-full flex items-center justify-center">
          <p class="text-gray-400 text-center">
            Pilih{" "}
            <span
              class="text-blue-500 cursor-pointer"
              onClick={() =>{
                guitarBuilderMenuCtx
                  .setSelectedSubmenu('Pickup Configuration')
              }}
            >
              konfigurasi pickup
            </span>{" "}
            terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class="flex flex-col text-white-950 px-2 gap-3 h-full">
      {props.children}
    </div>
  );
}

export function GuitarBuilderSubmenuGroup(props: { children: JSX.Element }) {
  return (
    <div class="flex flex-col gap-2 group first:mt-2 last:mb-2">
      {props.children}
      <hr class="group-last:hidden mt-2 border border-gray-600" />
    </div>
  );
}

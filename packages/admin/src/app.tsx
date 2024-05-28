import { useBeforeLeave, useLocation, useNavigate,  } from "@solidjs/router";
import { JSX, Show, createEffect, createSignal } from "solid-js";
import { Button } from "./commons/components/button";
import { ToggleableButton } from "./commons/components/toggleable-button";

export function App(props: any) {
  const [isExpanded, setIsExpanded] = createSignal(false);
  useBeforeLeave((_)=>{
    setIsExpanded(false);
  })

  return (
    <div class="relative h-screen">
      <div class={"absolute z-10 transition-transform transform "+ (isExpanded() ? "" : "-translate-x-full")}>
        <nav
          class={"bg-gray-800 text-white-950 h-screen transition-all relative w-44 " + (isExpanded() ? "" : " opacity-50 hover:opacity-100")}
        >
          <div class="absolute left-[calc(100%+0.5rem)] top-2 z-[1]">
            <Button
              class="!bg-gray-800"
              onClick={() => setIsExpanded(!isExpanded())}
            >
              <i class="bi bi-list" />
            </Button>
          </div>
          <div class="p-3 flex flex-col gap-3">
            
            <Link href="/guitar-models">Model</Link>
            <Link href="/headstocks">Headstock</Link>
            <Link href="/bridges">Bridge</Link>
            <Link href="/jacks">Jack</Link>
            <Link href="/knobs">Knob</Link>
            <Link href="/nuts">Nut</Link>
            <Link href="/tuning-machines">Tuning Machine</Link>
            <Link href="/pickups">Pickup</Link>
            <Link href="/switchs">Switch</Link>
          </div>
        </nav>
      </div>
      <Show when={isExpanded()}>
        <div
          class="absolute z-[9] bg-black opacity-50 w-full h-full"
          onClick={() => setIsExpanded(false)}
        ></div>
      </Show>
      <div class="h-full">{props.children}</div>
    </div>
  );
}

function Link(props : {
  href : string;
  children ?: JSX.Element;
}){
  const navigate = useNavigate();
  const location = useLocation();
  return <ToggleableButton
    onClick={()=>navigate(props.href)}
    isActive={location.pathname === props.href || location.pathname.startsWith(props.href + "/")}
    class="grow flex gap-2 items-center px-2"
  >
    {props.children}
  </ToggleableButton>
}

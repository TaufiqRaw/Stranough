import { getOwner } from "solid-js/web";
import PixiCanvas, { PixiCanvasOnLoadedItem } from "./PixiCanvas";
import { GuitarBodySPEnum, useGuitarBodyState } from "~/contexts/GuitarConfigContext";
import { initBody } from "~/utils/canvas/body/initBody";
import { Owner } from "solid-js";

export default function MainCanvas() {

  const guitarBodyState = useGuitarBodyState();

  const owner = getOwner() as Owner;

  const onPixiLoaded = async (ev: PixiCanvasOnLoadedItem) => {
    await initBody(ev, guitarBodyState, owner);
  };
  return <PixiCanvas onLoaded={onPixiLoaded} resizeTo={'container'} />;
}

import { Show, createMemo } from "solid-js";
import { ElecticModelPresenterProps } from "~/commons/presenter/types";
import { useGuitarBuilderContext } from "../guitar-builder";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { toCommonPresenter } from "~/commons/functions/to-common-presenter";
import { GuitarBuilderRegisterStringSpawnpoints } from "./guitar-builder-string-presenter";
import { Bridge } from "stranough-common";

export function createGuitarBuilderBridgeHook() : ()=>ElecticModelPresenterProps['bridge']{
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const bridge = createMemo(()=>guitarBuilderCtx.electric.bridge.get());
  const bridge2 = createMemo(()=>guitarBuilderCtx.electric.bridge2.get());

  return ()=>{
  if(!bridge()) return undefined;
  return [{
    bottom : bridge()?.bottomPoint.get(),
    bottomPointY : bridge()?.bottomPoint.get()?.y ?? 0,
    render : ()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx!.electric.bridge.get()!)}>
      {/* when bridge type is mono the spawnpoints is handled by the body */}
      <Show when={bridge()?.stringSpawnPoint.state().map(s=>s.get()?.position.get()).every(p=>p) && bridge()?.type.get() !== 'mono'}>
        <GuitarBuilderRegisterStringSpawnpoints
          spawnpoints={()=>bridge()?.stringSpawnPoint.state().map(s=>s.get()?.position.get())!}
          type={[`${Bridge.BridgeType.Tailpiece}`, 
            `${Bridge.BridgeType.NearTailpiece}`].includes(bridge()?.type.get()!) 
              ? 'tailpiece' : 'bridge'}
        />
      </Show>
    </CommonPresenter>,
    type : bridge()?.type.get(),
  }, bridge2() ? {
    bottom : bridge2()?.bottomPoint.get(),
    bottomPointY : bridge2()?.bottomPoint.get()?.y ?? 0,
    render : ()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx!.electric.bridge2!.get()!)}>
      <Show when={bridge2()?.stringSpawnPoint.state().map(s=>s.get()?.position.get()).every(p=>p)}>
        <GuitarBuilderRegisterStringSpawnpoints
          spawnpoints={()=>bridge2()?.stringSpawnPoint.state().map(s=>s.get()?.position.get())!}
          type={[`${Bridge.BridgeType.Tailpiece}`, 
            `${Bridge.BridgeType.NearTailpiece}`].includes(bridge2()?.type.get()!) 
              ? 'tailpiece' : 'bridge'}
        />
      </Show>
    </CommonPresenter>,
    type : bridge2()?.type.get(),
  } : undefined] as ElecticModelPresenterProps['bridge']}
} 
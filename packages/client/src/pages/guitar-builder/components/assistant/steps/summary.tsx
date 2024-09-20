import { Accessor, For, Show, createMemo, createResource, createSignal, onMount } from "solid-js";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { priceFormat } from "~/commons/functions/price-format";
import * as R from 'remeda';
import { GuitarBuilder } from "stranough-common";
import { Button } from "../utils/button";
import { Portal } from "solid-js/web";
import { Input } from "~/commons/components/input";
import { axios } from "~/commons/axios-instance";
import { selectedItemVirtuals } from "~/pages/guitar-builder/utils/types";
import { A, useNavigate } from "@solidjs/router";
import { Caption } from "../utils/caption";
import { TypingEffect } from "../../utils/typing-effect";
import { useAssistant } from "../_assistant";
import { ServerDtos, ServerEntities } from "stranough-server";
import * as QRCode from 'qrcode';
import { Constants } from "~/constants";
import { ImageSource, Texture } from "pixi.js";

export function Summary(props : {
  isPreview ?: boolean,
  feedback ?: string,
  renderFront : Accessor<(()=>Promise<HTMLImageElement| undefined>)>,
  renderBack : Accessor<(()=>Promise<HTMLImageElement| undefined>)>,
}){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const {orderId} = useAssistant()!;
  const [qr, setQr] = createSignal<string>();

  if(!guitarBuilderCtx.changeSaved()){
    guitarBuilderCtx.saveGuitar();
  }

  onMount(async ()=>{
    if(!orderId()) return;
    const qr = await QRCode.toDataURL(Constants.appUrl + '/builder/' + orderId()!);
    setQr(qr);
  })

  function downloadQr(){
    const a = document.createElement('a');
    a.href = qr()!;
    a.download = 'qr-code.png';
    a.click();
  }

  async function printGuitar(){
    const frontGuitar = await props.renderFront()?.();
    const backGuitar = await props.renderBack()?.();
    const scaleGuitar = 1/3;
    const guitarGap = 10;

    if(frontGuitar && backGuitar && qr()){
      const backGuitarCanvas = document.createElement('canvas');
      const backGuitarCtx = backGuitarCanvas.getContext('2d')!;
      backGuitarCanvas.width = backGuitar.width;
      backGuitarCanvas.height = backGuitar.height;
      //flip back guitar
      backGuitarCtx.translate(backGuitar.width, 0);
      backGuitarCtx.scale(-1, 1);
      backGuitarCtx.drawImage(backGuitar, 0, 0);

      const backGuitarResult = backGuitarCanvas.toDataURL();
      const backGuitarImg = new Image();
      backGuitarImg.src = backGuitarResult;
      await backGuitarImg.decode();

      const canvas = document.createElement('canvas');
      const qrImg = new Image();
      qrImg.src = qr()!;
      await qrImg.decode();
      const totalWidth = (frontGuitar.width + backGuitar.width) * scaleGuitar + guitarGap
      canvas.width = totalWidth;
      canvas.height = (frontGuitar.height ) * scaleGuitar + qrImg.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qrImg, (totalWidth/2) - (qrImg.width/2), frontGuitar.height * scaleGuitar);
      ctx.scale(scaleGuitar, scaleGuitar);
      ctx.drawImage(frontGuitar, 0, 0);
      ctx.drawImage(backGuitarImg, frontGuitar.width + guitarGap / scaleGuitar, 0);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guitar.png';
      a.click();
    }   
    console.log(frontGuitar);
  }

  // const [feedback] = createResource(async ()=>{
  //   if(props.isPreview) return undefined;
  //   return await assistantSocket.askFeedback();
  // })

  //   if(!feedback()){
  //     alert('Terjadi kesalahan saat mengirim pesanan');
  //     return;
  //   }

  const prices = createMemo(()=>{
    const res = [] as {label : string, name : string, price : number}[];
    const prices = R.entries.strict(guitarBuilderCtx.electricPrices());
    for(const [key, value] of prices){
      if((GuitarBuilder.mustImplementLabel as unknown as string[]).includes(key)){
        const selectedItem = guitarBuilderCtx.electric[key as typeof GuitarBuilder.mustImplementLabel[number]]?.get();
        res.push({label : GuitarBuilder.electricItemLabels[key]!, name : selectedItem?.placeholder.name.get() ?? "Tidak ada", price : value});
      }else{
        const selectedItemLabel = GuitarBuilder.selectedElectricItemNames[key as keyof Omit<GuitarBuilder.SelectedItem['electric'], typeof GuitarBuilder.mustImplementLabel[number]>](guitarBuilderCtx.electric[key as keyof GuitarBuilder.SelectedItem['electric']].get() as undefined) ?? 'Tidak ada';
        res.push({label : GuitarBuilder.electricItemLabels[key]!, name : selectedItemLabel, price : value}); 
      }
    }
    return res;
  })
  return <div class="p-2 overflow-y-auto overflow-x-hidden h-full">
    <div class="font-bold text-xl text-center pb-2 border-b border-gray-500 mb-3">Ringkasan Pesanan</div>
    <Caption type="info" class="mb-2">
      <div class="font-bold text-center text-green-500">Pesanan telah disimpan</div>
      <Show when={qr()}>
        <div class="flex items-center flex-col gap-2 justify-center">
          <div class="relative">
            <img src={qr()} alt="QR Code" class="rounded-md"/>
            <i class="absolute left-1 top-1 bi-download bg-[#00000088] p-2 rounded-md hover:text-blue-500 text-lg cursor-pointer" onClick={downloadQr}/>
          </div>
          <span class="text-sm text-gray-400">* Gunakan kode qr ini jika ingin melihat kembali pesanan ini</span>
          <span class="text-sm text-gray-400">* Gunakan kode qr ini jika ingin mengkonfirmasi pesanan dengan stranough hotline <a class="text-blue-500 hover:underline" href="https://wa.me/+6287825720098">+62 878-2572-0098</a></span>
        </div>
      </Show>
      <hr />
      <div>Kembali ke <A href="/" class="text-blue-500 underline">Dashboard</A> untuk melihat semua pesanan atau membuat pesanan baru</div>
      <hr />
      <Show
        when={props.renderBack() && props.renderFront()}
      >
        <Button onClick={printGuitar}>
          Cetak Pesanan
        </Button>
      </Show>
    </Caption>
    <Show when={guitarBuilderCtx.getSelectedCategory() === 'electric'}>
      <div class="flex flex-col gap-3">
        <Show when={props.feedback}>
          <Caption type="info" class="mb-2">
            <TypingEffect 
              text={props.feedback!}
            />
          </Caption>
        </Show>
        <For each={prices()}>
          {({
            label,
            name,
            price
          }) => <ItemPrice label={label} name={name} price={price} />}
        </For>
      </div>
    </Show>
  </div>
}


function ItemPrice(props : {
  label : string,
  name : string,
  price : number,
}){
  return <div>
  <div class="font-medium">{props.label}</div>
  <div class="flex justify-between">
    <div>{props.name}</div>
    <div class="relative grow">
      <div class="w-full absolute top-1/2 transform -translate-y-1/2 px-2">
        <div
          class="border-b border-dashed border-gray-400 "
        />
      </div>
    </div>
    <div>Rp. {priceFormat(props.price)}</div>  
  </div>
</div> 
}
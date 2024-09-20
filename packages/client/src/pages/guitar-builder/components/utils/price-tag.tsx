import { priceFormat } from "~/commons/functions/price-format";
import { useGuitarBuilderContext } from "../../guitar-builder";

export function PriceTag(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  return <div class="bg-gray-800 w-40 flex flex-col text-white-950 items-center p-2 rounded-md gap-1">
    <div class="">
      Total Harga
    </div>
    <div class="px-2 py-1 border border-gray-500 rounded-md w-full">
      <span class="text-sm">Rp.</span> <span class="font-bold">{priceFormat(guitarBuilderCtx.totalPrice())}</span>
    </div>
  </div>
}
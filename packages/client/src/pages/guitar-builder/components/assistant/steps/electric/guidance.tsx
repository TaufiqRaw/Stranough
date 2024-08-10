import { JSX } from "solid-js";
import { GuitarBuilder } from "stranough-common";

export const electricAssistantGuidance : {
  [k in keyof GuitarBuilder.SelectedItem['electric']] ?: (() => JSX.Element)
} = {
  backBinding : undefined,
  backContour : undefined,
  // bodyColor : undefined,
  // bodyColorType : undefined,
  bodyCoreWood : undefined,
  bodyLogo : undefined,
  bodyTopWood : undefined,
  bodyType : undefined,
  bridge : undefined,
  bridgePickup : undefined,
  constructionMethod : ConstructionMethodGuide,
  guitarModel : undefined,
  headstock : undefined,
  headstockBinding : undefined,
  headstockLogo : undefined,
  headstockOverlay : undefined,
  knob : undefined,
  middlePickup : undefined,
  neckBinding : undefined,
  // neckColor : undefined,
  // neckColorType : undefined,
  neckPickup : undefined,
  neckWood : undefined,
  nut : undefined,
  peg : undefined,
  pickupConfiguration : undefined,
  scaleLength : undefined,
  stringCount : undefined,
  topBinding : undefined,
  topContour : undefined,
}

function ConstructionMethodGuide(){
  return <>
    Metode konstruksi adalah cara bagaimana body dan neck gitar dihubungkan, ada tiga metode konstruksi yang umum digunakan, yaitu:
    <div class="flex flex-col gap-2 mt-1">
      <span class="border-l-2 border-blue-500 pl-2 py-2 bg-gray-700">Bolt-on, metode ini adalah metode yang paling umum digunakan, neck gitar dihubungkan dengan body menggunakan baut.</span>
      <span class="border-l-2 border-blue-500 pl-2 py-2 bg-gray-700">Set-neck, metode ini adalah metode yang neck gitar dihubungkan dengan body menggunakan perekat khusus.</span>
      <span class="border-l-2 border-blue-500 pl-2 py-2 bg-gray-700">Neck-through, metode ini adalah metode yang neck gitar dan body dibuat dari satu potongan kayu yang sama.</span>
    </div>
    Metode konstruksi yang berbeda akan memberikan karakteristik suara yang berbeda.
  </>
}

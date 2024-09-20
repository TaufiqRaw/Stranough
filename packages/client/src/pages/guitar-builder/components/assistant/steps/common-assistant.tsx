import { GuitarBuilder } from "stranough-common";
import { NeckProfileSelector } from "../../selectors/neck-profile-selector";
import { StringCountSelector } from "../../selectors/string-count-selector";
import { AssistantSelector } from "../utils/assistant-selector";
import { JSX } from "solid-js";
import { TrussRodPositionSelector } from "../../selectors/truss-rod-position-selector";
import { TrussRodTypeSelector } from "../../selectors/truss-rod-type-selector";
import { CarbonFiberRodSelector } from "../../selectors/carbon-fiber-rod-selector";
import { FingerboardWoodSelector } from "../../selectors/fingerboard-wood-selector";
import { NeckWoodSelector } from "../../selectors/electric/neck-wood-selector";
import { UseFretSelector } from "../../selectors/use-fret-selector";
import { FingerboardRadiusSelector } from "../../selectors/fingerboard-radius-selector";
import { FretCountSelector } from "../../selectors/fret-count-selector";
import { FingerboardEdgeSelector } from "../../selectors/fingerboard-edge-selector";
import { TopBindingSelector } from "../../selectors/top-binding-selector";
import { BackBindingSelector } from "../../selectors/back-binding-selector";
import { NeckBindingSelector } from "../../selectors/neck-binding-selector";
import { HeadstockBindingSelector } from "../../selectors/headstock-binding-selector";
import { SideInlaySelector } from "../../selectors/side-inlay-selector";
import { HeadstockSelector } from "../../selectors/headstock-selector";
import { PegSelector } from "../../selectors/peg-selector";
import { BurstTypeSelector } from "../../selectors/burst-type.selector";
import { BurstColorSelector } from "../../selectors/burst-color-selector";
import { PickguardMaterialSelector } from "../../selectors/pickguard-material-selector";
import { NutSelector } from "../../selectors/nut-selector";
import { BodyColorSelector } from "../../selectors/body-color-selector";
import { BodyColorTypeSelector } from "../../selectors/body-color-type-selector";
import { NeckColorSelector } from "../../selectors/neck-color-selector";
import { NeckColorTypeSelector } from "../../selectors/neck-color-type-selector";
import { HeadstockOverlaySelector } from "../../selectors/electric/headstock-overlay-selector";

export type OmittedCommonAssistant = 'guitarModel'

export const commonAssistant : {
  [key in keyof Omit<GuitarBuilder.SelectedItem['acoustic' | 'electric'], OmittedCommonAssistant>] : () => JSX.Element
} = {
  backBinding : BackBindingAssist,
  neckBinding : NeckBindingAssist,
  headstockBinding : HeadstockBindingAssist,
  topBinding : TopBindingAssist,
  topBodyColor : TopBodyColorAssist,
  topBodyColorType : TopBodyColorTypeAssist,
  backBodyColor : BackBodyColorAssist,
  backBodyColorType : BackBodyColorTypeAssist,
  burstType : BurstTypeAssist,
  burstColor : BurstColorAssist,
  
  neckProfile: NeckProfileAssist,
  neckColor : NeckColorAssist,
  neckColorType : NeckColorTypeAssist,
  stringCount: StringCountAssist,
  headstock : HeadstockAssist,
  headstockOverlay : HeadstockOverlayAssist,
  peg : PegAssist,
  scaleLength : ()=>null,
  nut : NutAssist,
  neckWood : NeckWoodAssist,
  trussRodType : TrussRodTypeAssist,
  trussRodPosition : TrussRodPositionAssist,
  carbonFiberRod : CarbonFiberRodAssist,
  fingerboardWood : FingerboardWoodAssist,
  sideInlay : SideInlayAssist,
  fingerboardRadius : FingerboardRadiusAssist,
  useFret : UseFretAssist,
  fretCount : FretCountAssist,
  fingerboardEdge : FingerboardEdgeAssist,
  pickguardMaterial : PickguardMaterialAssist,
} 

function HeadstockAssist(){
  return <AssistantSelector
    title="Pilih headstock gitar"
    componentKey="headstock"
    itemSelector={HeadstockSelector}
  />

}

function NeckProfileAssist(){
  return <AssistantSelector
    title="Pilih jenis profil leher"
    componentKey="neckProfile"
    guidance={()=>"profil leher adalah kontur atau bentuk cengkeraman leher, penting untuk permainan yang optimal dan kenyamanan tangan."}
    itemSelector={NeckProfileSelector}
  />
}

function StringCountAssist(){
  return <AssistantSelector
    title="Pilih jumlah senar"
    componentKey="stringCount"
    itemSelector={StringCountSelector}
  />
}

function TrussRodPositionAssist(){
  return <AssistantSelector
    title="Pilih posisi truss rod"
    componentKey="trussRodPosition"
    itemSelector={TrussRodPositionSelector}
  />
}

function FingerboardWoodAssist(){
  return <AssistantSelector
    title="Pilih kayu fingerboard"
    componentKey="fingerboardWood"
    itemSelector={FingerboardWoodSelector}
  />
}

function TrussRodTypeAssist(){
  return <AssistantSelector
    title="Pilih jenis truss rod"
    componentKey="trussRodType"
    itemSelector={TrussRodTypeSelector}
  />
}

function CarbonFiberRodAssist(){
  return <AssistantSelector
    title="Apakah anda ingin menggunakan carbon fiber rod?"
    guidance={()=><>
      <img src="/assets/gui/carbon-fiber.jpg" alt="carbon fiber rod" />
      <span>
        carbon fiber rod dapat melengkapi truss rod untuk membantu mencegah neck dari bending yang berlebihan.
      </span>
    </>}
    componentKey="carbonFiberRod"
    itemSelector={CarbonFiberRodSelector}
  />
}

function NeckWoodAssist(){
  return <AssistantSelector
    title="Pilih kayu untuk neck"
    componentKey="neckWood"
    itemSelector={NeckWoodSelector}
  />
}

function UseFretAssist(){
  return <AssistantSelector
    title="Apakah anda ingin menggunakan fret?"
    componentKey="useFret"
    itemSelector={UseFretSelector}
  />
}

function FingerboardRadiusAssist(){
  return <AssistantSelector
    title="Pilih radius fingerboard"
    componentKey="fingerboardRadius"
    guidance={()=><>
      <span>Radius fingerboard adalah ukuran lengkungan fingerboard di sepanjang lebarnya</span>
      <span>compound radius memiliki radius yang lebih kecil (lebih bulat) pada nut, dan radius yang lebih besar (lebih datar) pada sambungan leher dan badan.</span>
    </>}
    itemSelector={FingerboardRadiusSelector}
  />
}

function FretCountAssist(){
  return <AssistantSelector
    title="Pilih jumlah fret"
    componentKey="fretCount"
    itemSelector={FretCountSelector}
  />
}

function FingerboardEdgeAssist(){
  return <AssistantSelector
    title="Pilih jenis tepi fingerboard"
    componentKey="fingerboardEdge"
    itemSelector={FingerboardEdgeSelector}
  />
}

function TopBindingAssist(){
  return <AssistantSelector
    title="Pilih binding atas pada body gitar"
    componentKey="topBinding"
    itemSelector={TopBindingSelector}
  />
}

function BackBindingAssist(){
  return <AssistantSelector
    title="Pilih binding belakang pada body gitar"
    componentKey="backBinding"
    itemSelector={BackBindingSelector}
  />
}

function NeckBindingAssist(){
  return <AssistantSelector
    title="Pilih binding leher gitar"
    componentKey="neckBinding"
    itemSelector={NeckBindingSelector}
  />
}

function HeadstockBindingAssist(){
  return <AssistantSelector
    title="Pilih binding headstock gitar"
    componentKey="headstockBinding"
  itemSelector={HeadstockBindingSelector}
  />
}

function SideInlayAssist(){
  return <AssistantSelector
    title="Pilih inlay samping fingerboard"
    componentKey="sideInlay"
    itemSelector={SideInlaySelector}
  />
}

function PegAssist(){
  return <AssistantSelector
    title="Pilih peg gitar"
    componentKey="peg"
    itemSelector={PegSelector}
  />
}

function BurstTypeAssist(){
  return <AssistantSelector
    title="Pilih jenis burst pada body gitar"
    componentKey="burstType"
    itemSelector={BurstTypeSelector}
  />
}

function BurstColorAssist(){
  return <AssistantSelector
    title="Pilih warna burst pada body gitar"
    componentKey="burstColor"
    itemSelector={BurstColorSelector}
  />
}

function PickguardMaterialAssist(){
  return <AssistantSelector
    title="Pilih material pickguard"
    componentKey="pickguardMaterial"
    itemSelector={PickguardMaterialSelector}
  />
}

function NutAssist(){
  return <AssistantSelector
    title="Pilih jenis nut"
    componentKey="nut"
    itemSelector={NutSelector}
  />
}

function TopBodyColorAssist(){
  return <AssistantSelector
    title="Pilih warna atas body gitar"
    componentKey="topBodyColor"
    itemSelector={()=><BodyColorSelector type="top"/>}
  />
}

function TopBodyColorTypeAssist(){
  return <AssistantSelector
    title="Pilih jenis warna atas body gitar"
    componentKey="topBodyColorType"
    itemSelector={()=><BodyColorTypeSelector type="top"/>}
  />
}

function BackBodyColorAssist(){
  return <AssistantSelector
    title="Pilih warna belakang & samping body gitar"
    componentKey="backBodyColor"
    itemSelector={()=><BodyColorSelector type="back"/>}
  />
}

function BackBodyColorTypeAssist(){
  return <AssistantSelector
    title="Pilih jenis warna belakang & samping body gitar"
    componentKey="backBodyColorType"
    itemSelector={()=><BodyColorTypeSelector type="back"/>}
  />
}

function NeckColorAssist(){
  return <AssistantSelector
    title="Pilih warna neck gitar"
    componentKey="neckColor"
    itemSelector={NeckColorSelector}
  />
}

function NeckColorTypeAssist(){
  return <AssistantSelector
    title="Pilih jenis warna neck gitar"
    componentKey="neckColorType"
    itemSelector={NeckColorTypeSelector}
  />
}

function HeadstockOverlayAssist(){
  return <AssistantSelector
    title="Pilih headstock overlay"
    componentKey="headstockOverlay"
    itemSelector={HeadstockOverlaySelector}
  />
}
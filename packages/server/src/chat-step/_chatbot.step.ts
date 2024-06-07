import { ConstructionMethodStep } from "./construction-method.step";
import { GuitarContour } from "./guitar-contour.step";
import { GuitarModelStep } from "./guitar-model.step";
import { GuitarTypeStep } from "./guitar-type.step";
import { OrientationStep } from "./orientation.step";
import { PickupConfigurationStep } from "./pickup-configuration.step";
import { BodyBackBindingStep, BodyColorTypeStep, BodyCoreWoodStep, BodyFinishStep, BodyTopBindingStep, BodyTopWoodStep } from "./body-static.step";
import { StringCountStep } from "./string-count.step";
import { IMainChatStep } from "../interfaces/chatbot.interface";
import { Satisfies } from "../interfaces/satisfies.interface";
import { NeckWoodStep } from "./neck-static.step";
import { HeadstockTypeStep } from "./headstock-type.step";

export type ChatbotStepsType = typeof chatbotSteps[number]["key"];

export const chatbotSteps = [
  { key: "guitar-type", instance: new GuitarTypeStep() },
  { key: "guitar-model", instance: new GuitarModelStep() },
  { key: "construction-method", instance: new ConstructionMethodStep() },
  { key: "string-count", instance: new StringCountStep() },
  { key: "orientation", instance: new OrientationStep() },
  // { key: "scale-length", instance: {} },
  { key: "pickup-configuration", instance: new PickupConfigurationStep()},
  { key: "guitar-contour", instance: new GuitarContour() },

  { key: "body-core-wood", instance: new BodyCoreWoodStep()},
  { key: "body-top-wood", instance: new BodyTopWoodStep() },
  { key: "body-top-binding", instance: new BodyTopBindingStep()},
  { key: "body-back-binding", instance: new BodyBackBindingStep() },
  // { key: "body-color-type", instance: new BodyColorTypeStep()},
  // { key: "body-color", instance: new BodyColor },
  { key: "body-finish", instance: new BodyFinishStep() },

  { key: "neck-wood", instance: new NeckWoodStep() },
  // { key: "neck-profile", instance: {} },
  // { key: "neck-binding", instance: {} },
  // { key: "neck-color-type", instance: {} },
  // { key: "neck-color", instance: {} },
  // { key: "neck-finish", instance: {} },

  { key: "headstock-type", instance: new HeadstockTypeStep()},
  // { key: "headstock-overlay", instance: {} },
  // { key: "headstock-binding", instance: {} },
  // { key: "headstock-color-type", instance: {} },
  // { key: "headstock-color", instance: {} },
  // { key: "headstock-finish", instance: {} },

  // { key: "fingerboard-wood", instance: {} },
  // { key: "fingerboard-inlay", instance: {} },
  // { key: "fretless-or-fretted", instance: {} },
  // { key: "fret-number", instance: {} },

  // { key: "pickguard-type", instance: {} },
  // { key: "picguard-color-type", instance: {} },

  // { key: "component-tuning-machine", instance: {} },
  // { key: "component-nut", instance: {} },
  // { key: "component-bridge", instance: {} },
  // { key: "component-pickup", instance: {} },
  // { key: "component-knob", instance: {} },
  // { key: "component-switch", instance: {} },
  // { key: "component-jack", instance: {} },
] as const;
import { IMainChatStep, IUserChatContext, StepResponse } from "../interfaces/chatbot.interface";
import { invalidInputError } from "../utils/classes/chatbot.error.class";
import { staticStepFactory } from "./static-step-factory";

export const pickupConfigurationList = Object.freeze(["s","s-s","s-s-s","h","h-s","h-h","h-s-s","h-s-h","h-h-h","p90","p90-p90"] as const);

export const PickupConfigurationStep = staticStepFactory(pickupConfigurationList, "Pilih konfigurasi pickup yang kamu inginkan");
import { Chatbot, ServerEntities } from "stranough-server";
import { orientationList } from "stranough-server/dist/chat-step";
import { SignalObject } from "~/commons/interfaces/signal-object";
import { Headstock } from "~/pages/admin/headstock-editor/utils/types";
import { GuitarModel } from "~/pages/admin/model-editor/utils/types";

export interface IGuitarComponent {
  context : SignalObject<Chatbot.ChatbotStepsType>,
  isElectric : SignalObject<boolean | undefined>,
  guitarModel : SignalObject<GuitarModel | undefined>,
  constructionMethod : SignalObject<typeof ServerEntities.GuitarModel.bodyKeys[number] | undefined>,
  stringCount : SignalObject<number | undefined>,
  isLeftHanded : SignalObject<boolean | undefined>,
  headstock : SignalObject<Headstock | undefined>,
}
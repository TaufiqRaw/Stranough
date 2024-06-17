import { GuitarBody, GuitarBuilder, GuitarModel } from "stranough-common";
import { IUserChatContext } from "../interfaces/user-chat-context.interface";
import { ChatbotError, NotFoundError } from "../utils/classes/chatbot.error.class";
import { KeyOf } from "../interfaces/class-key.interface";
import { SocketDI } from "../controllers/socket";
import { findOneEntity } from "../utils/find-one-entity.util";
import { DI } from "../app";
import { ChatCompletionTool } from "openai/resources";

export class ChatbotService {
  private userContext : Map<string, IUserChatContext> = new Map();
  create(socketId: string) {
    return this.userContext.set(socketId, {
      chats : [],
      userId : socketId,
      selectedComponent : {} as IUserChatContext['selectedComponent']
    });
  }

  selectComponent(socketId: string, selected: { component: keyof GuitarBuilder.SelectedItem; value: string; }) {
    const userContext = this.userContext.get(socketId);
    if(!userContext) throw new ChatbotError("User context not found");
    
    userContext.selectedComponent[selected.component] = selected.value;
    let nextComponent = nextSelectionStep[selected.component];
    while(nextComponent && userContext.selectedComponent[nextComponent] !== undefined){
      nextComponent = nextSelectionStep[nextComponent];
    }
    if(nextComponent)
      return `Selanjutnya, anda dapat memilih ${selectionStepText[nextSelectionStep[selected.component]!]}`;
    else
      return `Selesai`
  }

  async ask(id : string,input : string){
    const userContext = this.userContext.get(id);
    if(!userContext) throw new ChatbotError("User context not found");
    userContext.chats.push({role : 'user' as const, content : input});
    const response = await requestCompletion(userContext);
    if(typeof response === 'string')
      return response;
    else
      return await processSelectComponentResponse(response);
  }

  start(socketId: string) : string[] {
    const msgs = ["Halo 👋, saya adalah asisten virtual yang akan membantu anda membuat gitar impian anda 🎸",
      "Anda dapat bertanya tentang gitar yang ingin anda buat, meminta rekomendasi atau memilih komponen dari menu yang tersedia",
      "jika anda memilih dari menu, maka anda dapat memulai dengan memilih tipe gitar yang anda inginkan"
    ]
    this.userContext.get(socketId)?.chats.push(...msgs.map(msg => ({role : 'assistant' as const, content : msg})));
    return msgs;
  }

  delete(socketId: string) {
    throw new Error("Method not implemented.");
  }
}

const selectProcessors : {
  [key in keyof GuitarBuilder.SelectedItem] ?: (value : string, context : IUserChatContext)=>Promise<string>
} = {
  bridge : async (v)=>{
    const id = parseInt(v);
    if(isNaN(id)) throw new NotFoundError();
    const bridge = await findOneEntity(SocketDI.repository.bridges, {name : v});
    if(!bridge) throw new NotFoundError();
    return `Anda memilih ${bridge.name}`;
  }
}

const nextSelectionStep : {
  [key in keyof GuitarBuilder.SelectedItem] ?: (keyof GuitarBuilder.SelectedItem )
} = {
  isElectric : 'guitarModel',
  guitarModel : 'constructionMethod',
  constructionMethod : 'topContour',
  topContour : 'backContour',
  backContour : 'bodyCoreWood',
  bodyCoreWood : 'bodyTopWood',
  bodyTopWood : 'bodyColorType',
  bodyColorType : 'bodyColor',
  bodyColor : 'neckWood',
  neckWood : 'headstock',
  headstock : 'peg',
  peg : 'bridge',
  jack : 'knob',
}

const selectionStepText : {
  [key in (keyof GuitarBuilder.SelectedItem | 'finish')] ?: string
} = {
  isElectric : 'Tipe gitar',
  guitarModel : 'Bentuk dasar gitar',
  constructionMethod : 'Metode konstruksi gitar',
  topContour : 'Kontur depan gitar',
  backContour : 'Kontur belakang gitar',
  bodyCoreWood : 'Kayu inti gitar',
  bodyTopWood : 'Kayu atas gitar',
  bodyColorType : 'Tipe warna gitar',
  bodyColor : 'Warna gitar',
  neckWood : 'Kayu leher gitar',
  headstock : 'Headstock gitar',
  peg : 'Pilih peg gitar',
  bridge : 'Pilih bridge gitar',
  jack : 'Pilih jack gitar',
  knob : 'Pilih knob gitar',
}

async function requestCompletion(context : IUserChatContext){
  const res = await askRequest(context);
  if(typeof res === 'string'){
    return res;
  }

  let selectedComponent = res as GuitarBuilder.SelectedItem;
  let loop = 0;
  const validValue = {} as GuitarBuilder.SelectedItem 
  while(Object.entries(selectedComponent).some(([k,v])=>v === 'get-valid-value') && loop < 5){
    //find object with get-valid-value value 
    const key = Object.entries(selectedComponent).find(([k,v])=>v === 'get-valid-value')?.[0] as keyof GuitarBuilder.SelectedItem;
    if(!key) break;

    //get valid value
    if(key === 'guitarModel'){
      const guitarModels = await SocketDI.repository.electricModels.findAll();
      if(guitarModels.length === 0) {
        validValue.guitarModel = ['get-valid-value'];
      }else{
        validValue.guitarModel = guitarModels.map(v=>v.name);
      }
    }
    if(key === 'bodyColor'){
      if(selectedComponent.bodyColorType === 'transparent'){
        validValue.bodyColor = ['clear'];
      }else{
        validValue.bodyColor = GuitarBuilder.bodyColorTypeToColorsMap[selectedComponent.bodyColorType as keyof typeof GuitarBuilder.bodyColorTypeToColorsMap];
      }      
    }
    if(key === 'headstock'){
      const headstocks = await SocketDI.repository.headstocks.findAll();
      if(headstocks.length === 0) {
        validValue.headstock = ['get-valid-value'];
      } else {
        validValue.headstock = headstocks.map(v=>v.name);
      }
    }
    if(key === 'peg'){
      const pegs = await SocketDI.repository.pegs.findAll();
      if(pegs.length === 0) {
        validValue.peg = ['get-valid-value'];
      } else {
        validValue.peg = pegs.map(v=>v.name);
      }
    }
    if(key === 'bridge'){
      const bridges = await SocketDI.repository.bridges.findAll();
      if(bridges.length === 0) {
        validValue.bridge = ['get-valid-value'];
      } else {
        validValue.bridge = bridges.map(v=>v.name);
      }
    }
    if(key === 'jack'){
      const jacks = await SocketDI.repository.jacks.findAll();
      if(jacks.length === 0) {
        validValue.jack = ['get-valid-value'];
      } else {
        validValue.jack = jacks.map(v=>v.name);
      }
    }

    if(key === 'knob'){
      const knobs = await SocketDI.repository.knobs.findAll();
      if(knobs.length === 0) {
        validValue.knob = ['get-valid-value'];
      } else {
        validValue.knob = knobs.map(v=>v.name);
      }
    }

    const newSelectedComponent = await askRequest(context, validValue, selectedComponent);
    if(typeof newSelectedComponent === 'string')
      return newSelectedComponent;

    Object.assign(selectedComponent, newSelectedComponent);
    loop++;
  }
  if(Object.entries(selectedComponent).some(([k,v])=>v === 'get-valid-value')){
    throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba ganti pertanyaan kamu");
  }
  return selectedComponent;
}

async function askRequest(context : IUserChatContext, validValue ?: {[ k in keyof GuitarBuilder.SelectedItem] ?: any[]}, lastSelectedComponents ?: GuitarBuilder.SelectedItem){
  const res = await DI.openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a virtual assistant at Stranough guitar technology that will help user to build a custom guitar, make sure your answer are concise and clear, no unecessary long text, here are some rules : if the user ask for recommendation or selecting component, use the select_component tool, Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."
      },
      ...context.chats
    ],
    tools: [
      selectComponentTool(validValue, lastSelectedComponents)
    ],
    tool_choice: "auto",
  });
  if(res.choices.length === 0) throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  if(res.choices[0].message.content){
    return res.choices[0].message.content;
  }else if(res.choices[0].message.tool_calls){
    const toolCall = res.choices[0].message.tool_calls[0].function.arguments;
    return JSON.parse(toolCall) as {
      [key in keyof GuitarBuilder.SelectedItem] ?: GuitarBuilder.SelectedItem[key] | 'get-valid-value'
    }
  }else{
    throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  }
}

function selectComponentTool(loadedValidValue ?: {[key in keyof GuitarBuilder.SelectedItem] ?: any[]}, lastSelectedComponents ?: GuitarBuilder.SelectedItem) : ChatCompletionTool{ 
  
  return {
  type: "function",
  function: {
    name: "select_components",
    description: "Select guitar component based on user input, ONLY SELECT ANYTHING THAT IN ENUM, DONT MAKE STUFF UP, if there is only one value in enum, select that value, just dont write stuff outside of enum",
    parameters: {
      type: "object",
      properties: {
        isElectric : {type : 'boolean'},
        guitarModel : {
          type : 'string',
          enum : !lastSelectedComponents?.guitarModel || lastSelectedComponents?.guitarModel === 'get-valid-value' 
          ? loadedValidValue?.guitarModel 
            ? loadedValidValue.guitarModel 
            : ['get-valid-value']
          : [lastSelectedComponents?.guitarModel]
        },
        constructionMethod : {
          type : 'string',
          enum : !lastSelectedComponents?.constructionMethod || lastSelectedComponents?.constructionMethod === 'get-valid-value'
            ? GuitarModel.bodyKeys
            : [lastSelectedComponents?.constructionMethod]
        },
        topContour : {
          type : 'string',
          enum : !lastSelectedComponents?.topContour || lastSelectedComponents?.topContour === 'get-valid-value'
            ? GuitarBody.topContourKeys
            : [lastSelectedComponents?.topContour]
        },
        backContour : {
          type : 'string',
          enum : !lastSelectedComponents?.backContour || lastSelectedComponents?.backContour === 'get-valid-value'
            ? GuitarBody.backContourKeys
            : [lastSelectedComponents?.backContour]
        },
        bodyCoreWood : {
          type : 'string',
          enum : !lastSelectedComponents?.bodyCoreWood || lastSelectedComponents?.bodyCoreWood === 'get-valid-value'
            ? GuitarBuilder.bodyCoreWoods.map(v=>v.name)
            : [lastSelectedComponents?.bodyCoreWood]
        },
        bodyTopWood : {
          type : 'string',
          enum : !lastSelectedComponents?.bodyTopWood || lastSelectedComponents?.bodyTopWood === 'get-valid-value'
            ? GuitarBuilder.bodyTopWoods.map(v=>v.name)
            : [lastSelectedComponents?.bodyTopWood]
        },
        bodyColorType : {
          type : 'string',
          enum : !lastSelectedComponents?.bodyColorType || lastSelectedComponents?.bodyColorType === 'get-valid-value'
            ? [...GuitarBuilder.bodyColorType.map(v=>v.name), 'transparent']
            : [lastSelectedComponents?.bodyColorType]
        },
        bodyColor : {
          type : 'string',
          enum : !lastSelectedComponents?.bodyColor || lastSelectedComponents?.bodyColor === 'get-valid-value'
            ? loadedValidValue?.bodyColor 
              ? loadedValidValue.bodyColor 
              : ['get-valid-value']
            : [lastSelectedComponents?.bodyColor]
        },
        neckWood : {
          type : 'string',
          enum : GuitarBuilder.neckWoods.map(v=>v.name)
        },
        headstock : {
          type : 'string',
          enum : !lastSelectedComponents?.headstock || lastSelectedComponents?.headstock === 'get-valid-value'
            ? loadedValidValue?.headstock 
              ? loadedValidValue.headstock 
              : ['get-valid-value']
            : [lastSelectedComponents?.headstock]
        },
        peg : {
          type : 'string',
          enum : !lastSelectedComponents?.peg || lastSelectedComponents?.peg === 'get-valid-value'
            ? loadedValidValue?.peg
              ? loadedValidValue.peg
              : ['get-valid-value']
            : [lastSelectedComponents?.peg]
        },
        bridge : {type : 'string',
          enum : !lastSelectedComponents?.bridge || lastSelectedComponents?.bridge === 'get-valid-value'
            ? loadedValidValue?.bridge
              ? loadedValidValue.bridge
              : ['get-valid-value']
            : [lastSelectedComponents?.bridge]
        },
        jack : {
          type : 'string',
          enum : !lastSelectedComponents?.jack || lastSelectedComponents?.jack === 'get-valid-value'
            ? loadedValidValue?.jack
            : [lastSelectedComponents?.jack]
        },
        knob : {
          type : 'string',
          enum : !lastSelectedComponents?.knob || lastSelectedComponents?.knob === 'get-valid-value'
            ? loadedValidValue?.knob
            : [lastSelectedComponents?.knob]
        },
      } as {[k in keyof GuitarBuilder.SelectedItem] : any},
      required : ['guitarModel', 'isElectric'] as (keyof GuitarBuilder.SelectedItem)[]
    },
  },
}};

async function processSelectComponentResponse(res : {[k in keyof GuitarBuilder.SelectedItem] ?: string}){
  const selectedComponent = {} as GuitarBuilder.SelectedItem;
  console.log(res)
  const {guitarModel, bridge, headstock, jack, knob, peg, } = res;
  Object.assign(selectedComponent, res);
  try{
    if(guitarModel){
      const selectedModel = (await SocketDI.repository.electricModels.findOneOrFail({name : guitarModel}));
      await selectedModel.deepLoadBodies();
      selectedComponent.guitarModel = selectedModel;
    }
    if(bridge){
      const selectedBridge = (await SocketDI.repository.bridges.findOneOrFail({name : bridge}));
      await selectedBridge.loadMedias() ;
      selectedComponent.bridge = selectedBridge;
    }
    if(headstock){
      const s = (await SocketDI.repository.headstocks.findOneOrFail({name : headstock}));
      await s.loadMedias();
      selectedComponent.headstock = s;
    }
    if(jack){
      const s = (await SocketDI.repository.jacks.findOneOrFail({name : jack}))
      await s.loadMedias();
      selectedComponent.jack = s;
    }
    if(knob){
      const s = (await SocketDI.repository.knobs.findOneOrFail({name : knob}))
      await s.loadMedias();
      selectedComponent.knob = s;
    }
    if(peg){
      const s = (await SocketDI.repository.pegs.findOneOrFail({name : peg}))
      await s.loadMedias();
      selectedComponent.peg = s;
    }
  }catch(e){
    throw new ChatbotError("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti")
  }
  return selectedComponent;
}
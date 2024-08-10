import { GuitarBuilder } from "stranough-common";
import { IUserChatContext, OpenAiComponentRecomendation } from "../interfaces/user-chat-context";
import {OpenAI} from "openai";
import { additionalComponentInfo, componentName, getComponentItems } from "./assistant.data.helper";
import { SocketDI } from "../controllers/socket";
import {unlink} from 'fs/promises'
import { imagePath } from "../constants";
import { DI } from "../app";

export class AssistantService {
  private userContext : Map<string, IUserChatContext> = new Map();
  private get(socketId: string) {
    return this.userContext.get(socketId);
  }
  create(socketId: string) {
    const newCtx : IUserChatContext = {
      chats : [],
      userId : socketId,
      selectedComponentName : {
        guitarType : 'Gitar Listrik', //TODO: remove this placeholder
        acoustic : {},
        electric : {},
        asMessage(){
          switch(newCtx.selectedComponentName.guitarType){
            case 'Gitar Listrik' :
            case 'Bass Listrik' :{
              return `this user has selected an ${newCtx.selectedComponentName.guitarType} with the following properties :
${Object.entries(newCtx.selectedComponentName.electric).map(([key, value])=>`${componentName[key as GuitarBuilder.SelectedItemKeys] ? componentName[key as GuitarBuilder.SelectedItemKeys] : key} : ${value}`).join('\n')}
              `
            }
            case 'Gitar Akustik' :
            case 'Bass Akustik' :{
              return `this user has selected an ${newCtx.selectedComponentName.guitarType} with the following properties :\n
${Object.entries(newCtx.selectedComponentName.acoustic).map(([key, value])=>`${componentName[key as GuitarBuilder.SelectedItemKeys] ? componentName[key as GuitarBuilder.SelectedItemKeys] : key} : ${value}`).join('\n')}
              `
            }
            default : throw new Error("Guitar type not found");
          }
        }
      },
      selectedComponent : {
        guitarType : 'electric-guitar', //TODO: remove this placeholder
        acoustic : {},
        electric : {},
      }
    };
    return this.userContext.set(socketId, newCtx);
  }

  async delete(socketId: string) {
    if(!this.get(socketId)){
      return DI.logger.error("AssistantService.delete : User not found");
    }

    try{
      if(this.get(socketId)!.preferencesType === 'image')
        await unlink(`${imagePath}/preference-${socketId}.png`);
    }catch(e){
      DI.logger.error(e);
    }
    return this.userContext.delete(socketId);
  }

  async uploadImage(socketId: string){
    if(!this.get(socketId)){
      throw new Error("User not found");
    }
    const validation = await validateImage(socketId);
    if(!validation) throw new Error("Image not valid");
    this.get(socketId)!.preferencesType = 'image';
  }
  async describeGuitar(socketId : string, description : string){
    if(!this.get(socketId)){
      throw new Error("User not found");
    }
    const validation = await validateDescription(description);
      if(!validation) throw new Error("Description not valid");
    this.get(socketId)!.preferencesType = 'description';
    this.get(socketId)!.preferencesDescription = description;
  }

  select(socketId : string, component : GuitarBuilder.SelectedItemKeys, selectedName : string, selectedKey : string | boolean){
    if(!this.get(socketId)){
      throw new Error("User not found");
    }
    switch(component){
      case 'guitarType' :
        // @ts-ignore
        this.get(socketId)!.selectedComponentName.guitarType = selectedName;
        // @ts-ignore
        this.get(socketId)!.selectedComponent.guitarType = selectedKey;
        break;
      case 'orientation' :
        // @ts-ignore
        this.get(socketId)!.selectedComponentName.orientation = selectedName;
        // @ts-ignore
        this.get(socketId)!.selectedComponent.orientation = selectedKey;
        break;
      default : {
        if(this.get(socketId)!.selectedComponent.guitarType === 'acoustic-guitar' || this.get(socketId)!.selectedComponent.guitarType === 'acoustic-bass'){
          // @ts-ignore
          this.get(socketId)!.selectedComponentName.acoustic[component] = selectedName;
          // @ts-ignore
          this.get(socketId)!.selectedComponent.acoustic[component] = selectedKey;

        }else if(this.get(socketId)!.selectedComponent.guitarType === 'electric-bass' || this.get(socketId)!.selectedComponent.guitarType === 'electric-guitar'){
          // @ts-ignore
          this.get(socketId)!.selectedComponentName.electric[component] = selectedName;
          // @ts-ignore
          this.get(socketId)!.selectedComponent.electric[component] = selectedKey;
        }else{
          throw new Error("Guitar type not found");
        }
      }
    }
    console.log(this.get(socketId)!.selectedComponentName, this.get(socketId)!.selectedComponent);
  }
  async askRecommendation(socketId: string, component : GuitarBuilder.SelectedItemKeys) : Promise<OpenAiComponentRecomendation>{
    const ctx = this.get(socketId);
    if(!ctx){
      throw new Error("User not found");
    }
    const selectedCtx = ctx.selectedComponent;
    if(!selectedCtx.guitarType){
      throw new Error("Guitar type not found");
    }
    switch(selectedCtx.guitarType){
      case 'electric-guitar' : {
        const _items = await getComponentItems["electric-guitar"][component as keyof GuitarBuilder.SelectedItem['electric']]?.(ctx);
        if(!_items){
          return {
            message : "No recommendations found",
            recommendations : []
          }
        }else{
          const {nullable, ...items} = _items;
          const candidates = Object.keys(items);
          const isCandidateHasPrice = Object.values(items).some(item=>item.price !== undefined);

          if(nullable){
            candidates.push('none');
          };
          const res = await reqOpenAIRecommendation(SocketDI.openai, ctx, candidates, {
            name : componentName[component] ? componentName[component]! : component.replace(/([A-Z])/g, " $1").toLowerCase(),
            additionalInfo : additionalComponentInfo[component],
            prices : isCandidateHasPrice ? Object.fromEntries(Object.entries(items).map(([key, value])=>[key, value.price])) : undefined
          });
          return {
            message : res.message,
            recommendations : res.recommendations.map(rec=>rec in items ? items[rec].key : rec)
          }
        }
      }
      default : {
        return {
          message : "No recommendations found",
          recommendations : []
        }
      }
    }
  }
}

function getReferenceImgPath(socketId : string){
  return `${process.env.SERVER_URL}/${process.env.SERVER_IMAGES_URL}/preference-${socketId}.png`;
}

async function reqOpenAIRecommendation(client : OpenAI, ctx : IUserChatContext, selections : string[], component : {
  name : string;
  additionalInfo ?: string;
  prices ?: {[x : string] : number | undefined};
}) : Promise<{
  recommendations : string[];
  message : string;
}> {
  if(!ctx.preferencesType)
    throw new Error("Preferences type not found");
  if(ctx.preferencesType === 'description' && !ctx.preferencesDescription)
    throw new Error("Preferences description not found");

  const systemMsg = {
    'role' : 'system',
    'content' : `You are a guitar builder, refer yourself as 'we', communicate in bahasa indonesia, you have to recommend a ${component.name}
     to the user based on the selections they have made and their preference : ${ctx.preferencesType === "description" ? "user preference" : "user image"}, be conservative with guessing, only recommend if you are sure of that.\n
     ${component.additionalInfo ? ", here are information about this component : " + component.additionalInfo + '\n' : ''}
     ${component.prices ? ", here are the prices for each component, any component that doesnt listed here means it free : " + Object.entries(component.prices).filter(([key, value])=>value !== undefined).map(([key, value])=>`${key} : ${value}`).join('\n') : ''}
     ${ctx.selectedComponentName.asMessage()}`
  } as OpenAI.Chat.Completions.ChatCompletionMessageParam;
  console.log(systemMsg);
  // console.log(`${process.env.SERVER_URL}/${process.env.SERVER_IMAGES_URL}/preference-${ctx.userId}.png`);
  const res = await client.chat.completions.create({
    model : "gpt-4o-mini", //TODO : change this to the actual model 4o
    messages : [
      systemMsg,
      {
        'role' : 'user',
        'content' : ctx.preferencesType === 'description'
          ? `I want a guitar that ${ctx.preferencesDescription}`
          : [
            {'type' : 'text', 'text' : 'recommend me guitar parts that looks like part on this image'},
            {"type" : 'image_url', 'image_url' : {
              url : getReferenceImgPath(ctx.userId)
            }}
          ]
      }
    ],
    tools : [{
      type : 'function',
      function : {
        name : 'recommendation',
        description : `Recommend a component based on the ${ctx.preferencesType === "description" ? "user preference" : "user image"} and the selections they have made`,
        parameters : {
          type : 'object',
          properties : {
            recommendations : {
              type : 'array',
              items : {
                type : 'string',
                enum : selections
              },
              description : 'The recommendations for the user, you can provide multiple recommendations, its space-sensitive and case-sensitive, make sure to provide the exact key of the component, maximum is 2 recommendations, but its better to recommend only one that you think is the best or closest to the user preference'
            },
            message : {
              type : 'string',
              description : 'The message to be displayed to the user, explaining the recommendations, keep it short and concise'
            }
          },
          required : ['recommendations', 'message']
        }
      }
    }],
    tool_choice : 'required',
  })
  if(res.choices.length === 0) throw new Error("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  if(res.choices[0].message.tool_calls){
    const toolCall = res.choices[0].message.tool_calls[0].function.arguments;
    return JSON.parse(toolCall) as {
      recommendations : string[];
      message : string;
    };
  }else{
    throw new Error("Chatbot tidak bisa memproses pesan kamu, coba lagi nanti");
  }
}

async function validateDescription(description : string) : Promise<boolean> {
  const res = await SocketDI.openai.chat.completions.create({
    model : "gpt-4o-mini", //TODO : change this to the actual model 4o
    messages : [
      {
        'role' : 'system',
        'content' : `Verify the description uploaded by the user, the description should have something about the guitar they want to build`
      },
      {
        'role' : 'user',
        'content' : description
      }
    ],
    tools : [{
      type : 'function',
      function : {
        name : 'is_description_valid',
        description : `Verify the description uploaded by the user, the description should have something about the the guitar they want to build`,
        parameters : {
          type : 'object',
          properties : {
            isValid : {
              type : 'boolean',
              description : 'Whether the description is valid or not'
            },
          },
          required : ['isValid']
        }
      }
    }],
    tool_choice : 'required',
  })
  if(res.choices.length === 0) throw new Error("Something went wrong");
  if(res.choices[0].message.tool_calls){
    const toolCall = res.choices[0].message.tool_calls[0].function.arguments;
    return JSON.parse(toolCall).isValid;
  } else {
    DI.logger.error("AssistantService.validateDescription : Cant process the description");
    throw new Error("Something went wrong");
  }
}

async function validateImage(socketId : string) : Promise<boolean> {
  const res = await SocketDI.openai.chat.completions.create({
    model : "gpt-4o-mini", //TODO : change this to the actual model 4o
    messages : [
      {
        'role' : 'system',
        'content' : `Verify the image uploaded by the user, the image should have a guitar in it`
      },
      {
        'role' : 'user',
        'content' : [
            {"type" : 'image_url', 'image_url' : {
              url : getReferenceImgPath(socketId)
            }}
          ]
      }
    ],
    tools : [{
      type : 'function',
      function : {
        name : 'is_image_valid',
        description : `Verify the image uploaded by the user, the image should have a guitar in it`,
        parameters : {
          type : 'object',
          properties : {
            isValid : {
              type : 'boolean',
              description : 'Whether the image contains a guitar or not'
            },
          },
          required : ['isValid']
        }
      }
    }],
    tool_choice : 'required',
  })
  if(res.choices.length === 0) throw new Error("Something went wrong");
  if(res.choices[0].message.tool_calls){
    const toolCall = res.choices[0].message.tool_calls[0].function.arguments;
    return JSON.parse(toolCall).isValid;
  } else {
    DI.logger.error("AssistantService.uploadImage : Cant process the image");
    throw new Error("Something went wrong");
  }
}
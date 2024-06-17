import { ChatCompletionTool, FunctionParameters } from "openai/resources";
import { DI } from "../app";
import { IUserChatContext } from "../interfaces/user-chat-context.interface";
import { ChatbotError } from "./classes/chatbot.error.class";

export async function createCompletionRequestUtil(options: {
  context: IUserChatContext;
  availableSelection?: FunctionParameters;
  additionalSystemMsg: string;
  overrideSystemMsg: boolean
}) {

  const tools = [] as ChatCompletionTool[];
  if (options.availableSelection) {
    tools.push({
      type: "function",
      function: {
        name: "select_components",
        description: "Select guitar component based on user input",
        parameters: {
          type: "object",
          properties: options.availableSelection,
        },
      },
    });
  }

  const res = await DI.openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: options.overrideSystemMsg
          ? options.additionalSystemMsg
          : "You are a virtual assistant at Stranough guitar technology that will help user to build a custom guitar, make sure your answer are concise and clear, no unecessary long text, here are some rules : if the user ask for recommendation or selecting component, use the select_component tool, Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous." +
            (options.additionalSystemMsg ? ", " + options.additionalSystemMsg : ""),
      },
      ...options.context.chats
    ],
    tools: tools,
    tool_choice: "auto",
  });

  if (res.choices.length === 0) {
    throw new ChatbotError(
      "Chatbot tidak bisa memproses pesan kamu, coba lagi nanti"
    );
  }
  if (!res.choices[0]?.message?.content) {
    throw new ChatbotError(
      "Chatbot tidak bisa memproses pesan kamu, coba lagi nanti"
    );
  }
  return res.choices[0].message.content;
}

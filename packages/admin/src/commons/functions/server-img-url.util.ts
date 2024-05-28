import { Constants } from "~/constants";

export function serverImgUrl (filename: string | undefined, useDefault = false) {
  if(!filename) return useDefault ? Constants.defaultImgUrl : undefined;
  return `${Constants.serverImgUrl}/${filename}`;
}
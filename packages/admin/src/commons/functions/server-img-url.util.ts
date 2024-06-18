import { Constants } from "~/constants";

export function serverImgUrl (filename: string | undefined) : string | undefined
export function serverImgUrl (filename: string | undefined, useDefault: boolean) : string
export function serverImgUrl (filename: string | undefined, useDefault = false) : string | undefined{
  if(!filename) return useDefault ? Constants.defaultImgUrl : undefined;
  return `${Constants.serverImgUrl}/${filename}`;
}
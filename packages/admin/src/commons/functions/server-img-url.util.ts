import { Constants } from "~/constants";

export function serverImgUrl (filename: string | undefined) {
  if(!filename) return  `${Constants.serverImgUrl}/none.jpg`;
  return `${Constants.serverImgUrl}/${filename}`;
}
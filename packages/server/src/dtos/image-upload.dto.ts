import { Expose } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class ImageUploadDto{
  @IsNotEmpty()
  name: string;
}
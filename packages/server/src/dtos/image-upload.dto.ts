import { IsNotEmpty, Matches } from "class-validator";
import { IMAGE_SIZE_LIMIT } from "../constants";

export class ImageUploadDto{
  @IsNotEmpty()
  name: string;
}
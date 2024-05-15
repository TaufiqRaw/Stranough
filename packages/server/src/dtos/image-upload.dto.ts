import { Expose } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";

export class ImageUploadDto{
  @Expose()
  @IsNotEmpty()
  name: string;
}
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ExposeAll } from "./util.decorator";

@ExposeAll()
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}

import { IsEmail, IsNotEmpty } from "class-validator";

export default class TokenPayloadDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  id: string;   
}

import { IsEmail, IsNotEmpty } from "class-validator";

export class TokenPayloadDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  id: string;   
}

export default TokenPayloadDto;
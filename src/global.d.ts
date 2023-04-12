import { TokenPayloadDto } from "./DTO";

declare global {
    namespace Express {
      interface Request {
        tkn: TokenPayloadDto;
      }
    }
  }
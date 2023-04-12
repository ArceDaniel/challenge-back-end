import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsDate,
  Validate,
  Matches,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "notPastDate", async: false })
export class NotPastDateConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    const now = new Date();
    return date.getTime() >= now.getTime();
  }

  defaultMessage() {
    return "Date cannot be in the past";
  }
}

@ValidatorConstraint({ name: "notPastHour", async: false })
export class NotPastHourConstraint implements ValidatorConstraintInterface {
  validate(hour: number) {
    const now = new Date();
    return hour >= now.getHours();
  }
}

export class EventDto {
  @Matches(/^[a-zA-Z0-9\s,'-]*$/)
  address: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @Validate(NotPastDateConstraint)
  date: Date;
}

export default EventDto;
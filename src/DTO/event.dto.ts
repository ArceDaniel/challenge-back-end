import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsDate,
  Validate,
  Matches,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "notPastDate", async: false })
export class NotPastDateConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    if (date === undefined) return false;
    const now = new Date();
    return date.getTime() >= now.getTime();
  }

  defaultMessage() {
    return "Date cannot be in the past";
  }
}

@ValidatorConstraint({ name: "notAfterStartHour", async: false })
export class NotAfterStartHourConstraint implements ValidatorConstraintInterface {
  validate(end_event: string, args: ValidationArguments) {
    const start_hour = args.object["start_event"];
    console.log(start_hour, end_event);
    
    return new Date(`2000-01-01 ${end_event}`) >= new Date(`2000-01-01 ${start_hour}`);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should not be before start_event`;
  }
}

export class EventDto {
  @Matches(/^[a-zA-Z0-9\s,'-]*$/)
  address: string;

  @IsNotEmpty()
  @IsDate()
  @Validate(NotPastDateConstraint)
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  start_event: string;

  
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @Validate(NotAfterStartHourConstraint)
  end_event: string;

  duration: number;

  getDuration(): number {
    const start = new Date(`2000-01-01T${this.start_event}:00`);
    const end = new Date(`2000-01-01T${this.end_event}:00`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }






}

export default EventDto;
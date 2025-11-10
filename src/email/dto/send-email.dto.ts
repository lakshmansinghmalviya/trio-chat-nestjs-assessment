import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: 'Receiver email must be valid' })
  to!: string;

  @IsString({ message: "Subject should be any text" })
  @IsNotEmpty({ message: 'Subject is required' })
  @MaxLength(200)
  subject!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: " Max length should exceed the 5000" })
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  from?: string; // optional override
}
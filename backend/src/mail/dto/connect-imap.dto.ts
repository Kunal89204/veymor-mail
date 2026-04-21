import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class ConnectImapDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  host!: string;

  @IsNumber()
  port!: number;

  @IsBoolean()
  secure!: boolean;
}

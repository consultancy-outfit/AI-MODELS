import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiPropertyOptional({ example: 'Ali Raza' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;
}

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: ['free', 'pro', 'team'] })
  plan!: 'free' | 'pro' | 'team';

  @ApiProperty()
  createdAt!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class VerifyTokenDto {
  @ApiProperty()
  @IsString()
  token!: string;
}

export class VerificationResponseDto {
  @ApiProperty()
  verified!: boolean;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class VerificationTokenResponseDto {
  @ApiProperty()
  verificationToken!: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty()
  message!: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  success!: boolean;
}

export class SessionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  lastActiveAt!: string;

  @ApiProperty()
  userAgent!: string;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadBody {
  @IsOptional() @IsString() filename?: string;
  @IsOptional() @IsString() mimeType?: string;
  @IsOptional() @Type(() => Number) @IsNumber() size?: number;
  @IsOptional() @IsString() sessionId?: string;
  @IsOptional() @IsString() modelId?: string;
  @IsOptional() @IsString() altText?: string;
  @IsOptional() @IsString() description?: string;
}

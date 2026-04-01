import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.services';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

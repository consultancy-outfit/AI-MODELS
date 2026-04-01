import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllers';
import { AuthPersistenceService } from './auth.persistence';
import { AuthService } from './auth.services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthPersistenceService],
  exports: [AuthService, AuthPersistenceService],
})
export class AuthModule {}

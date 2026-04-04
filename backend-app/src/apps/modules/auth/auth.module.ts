import { Module } from '@nestjs/common';
import { RefreshTokenGuard } from '../../common/auth/refresh-token.guard';
import { JwtService } from '../../common/auth/jwt.service';
import { AuthController } from './auth.controllers';
import { AuthPersistenceService } from './auth.persistence';
import { AuthService } from './auth.services';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthPersistenceService, JwtService, RefreshTokenGuard],
  exports: [AuthService, AuthPersistenceService, JwtService],
})
export class AuthModule {}

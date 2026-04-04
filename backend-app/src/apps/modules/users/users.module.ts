import { Module } from '@nestjs/common';
import { UsersService } from './users.services';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

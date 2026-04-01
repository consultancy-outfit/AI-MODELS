import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './apps/config/env.validation';
import { AuthModule } from './apps/modules/auth/auth.module';
import { ChatModule } from './apps/modules/chat/chat.module';
import { DashboardModule } from './apps/modules/dashboard/dashboard.module';
import { FormsModule } from './apps/modules/forms/forms.module';
import { ModelsModule } from './apps/modules/models/models.module';
import { UploadModule } from './apps/modules/upload/upload.module';
import { UsersModule } from './apps/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    AuthModule,
    UsersModule,
    ModelsModule,
    ChatModule,
    UploadModule,
    DashboardModule,
    FormsModule,
  ],
})
export class AppModule {}

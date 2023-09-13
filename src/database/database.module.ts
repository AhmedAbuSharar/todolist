import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { AppConfigService } from 'config/config.service';

@Module({
  providers: [...databaseProviders, AppConfigService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

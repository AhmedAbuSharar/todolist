import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/database/models';
import { TASK_REPOSITORY } from 'src/common/constants';
import { CustomLogger } from 'src/common/logger/logger.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useValue: Task,
    },
    CustomLogger,
  ],
  imports: [DatabaseModule],
})
export class TaskModule {}

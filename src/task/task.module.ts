import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/database/models';
import { TASK_REPOSITORY } from 'src/config/envConstants';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useValue: Task,
    },
  ],
})
export class TaskModule {}

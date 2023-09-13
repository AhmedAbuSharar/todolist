import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/database/models';
import { TASK_REPOSITORY } from 'src/common/constants';
import { CustomLogger } from 'src/common/logger/logger.service';
import { DatabaseModule } from 'src/database/database.module';
import { MyGateway } from './task.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEvent } from './task.event';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useValue: Task,
    },
    CustomLogger,
    MyGateway,
    EventEmitter2,
    TaskEvent,
  ],
  imports: [DatabaseModule],
})
export class TaskModule {}

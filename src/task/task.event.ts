import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2
import { CustomLogger } from 'src/common/logger/logger.service';

@Injectable()
export class TaskEvent {
  constructor(
    private readonly taskService: TaskService,
    private readonly eventEmitter: EventEmitter2,
    private customLogger: CustomLogger,
  ) {
    this.eventEmitter.on('task.created', (newTask) => {
      this.customLogger.log('New task created');
      console.log('New task created:', newTask);
    });

    this.eventEmitter.on('task.expired', (expiredTasks) => {
      this.customLogger.log('Tasks expired');
      console.log('Tasks expired:', expiredTasks);
    });
  }
}

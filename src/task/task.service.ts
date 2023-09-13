import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TASK_REPOSITORY } from '../common/constants';
import { Task } from 'src/database/models';
import { CreateTask, UpdateTask } from './dto';
import { CustomLogger } from 'src/common/logger/logger.service';
import { Op, Transaction } from 'sequelize';
import { TaskStatus } from 'src/common/enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    private customLogger: CustomLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  findAll(userId: number) {
    this.customLogger.log('findAll');
    return this.taskRepository.findAll({
      where: {
        userId,
      },
    });
  }
  async findOne(id: number, userId: number) {
    this.customLogger.log('findOne');
    const task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) throw new NotFoundException();
    return task;
  }
  async create(
    createTask: CreateTask,
    userId: number,
    transaction: Transaction,
  ) {
    this.customLogger.log('create');
    const deadline = new Date(createTask.deadline);
    const newTask = await this.taskRepository.create(
      {
        ...createTask,
        deadline,
        userId,
      },
      { transaction },
    );
    this.eventEmitter.emit('task.created', newTask);

    return newTask;
  }
  async remove(id: number, userId: number, transaction: Transaction) {
    this.customLogger.log('remove');
    await this.findOne(id, userId);
    return this.taskRepository.destroy({ where: { id, userId }, transaction });
  }
  async update(
    updateTask: UpdateTask,
    id: number,
    userId: number,
    transaction: Transaction,
  ) {
    this.customLogger.log('update');
    await this.findOne(id, userId);
    if (updateTask.deadline)
      updateTask.deadline = new Date(updateTask.deadline);

    const updatedData = await this.taskRepository.update(
      { ...updateTask },
      { where: { id, userId }, returning: true, transaction },
    );
    return updatedData;
  }
  async expired(transaction: Transaction) {
    this.customLogger.debug('handleCron Called every minute');
    const currentDate = new Date();
    const [updatedCount, tasksUpdated] = await this.taskRepository.update(
      {
        status: TaskStatus.EXPIRED,
      },
      {
        where: {
          status: {
            [Op.notIn]: [TaskStatus.DONE, TaskStatus.EXPIRED],
          },
          deadline: {
            [Op.lt]: currentDate,
          },
        },
        returning: true,
        transaction,
      },
    );
    if (updatedCount > 0) {
      this.eventEmitter.emit('task.expired', tasksUpdated);
    }
    this.customLogger.debug(`Updated ${updatedCount} tasks.`);
    return {
      updatedCount,
      tasksUpdated,
    };
  }
}

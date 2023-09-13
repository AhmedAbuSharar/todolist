import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TASK_REPOSITORY } from '../common/constants';
import { Task } from 'src/database/models';
import { CreateTask, UpdateTask } from './dto';
import { CustomLogger } from 'src/common/logger/logger.service';
import { Transaction } from 'sequelize';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    private customLogger: CustomLogger,
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
  create(createTask: CreateTask, userId: number, transaction: Transaction) {
    this.customLogger.log('create');
    const deadline = new Date(createTask.deadline);
    return this.taskRepository.create(
      {
        ...createTask,
        deadline,
        userId,
      },
      { transaction },
    );
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
}

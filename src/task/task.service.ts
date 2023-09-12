import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TASK_REPOSITORY } from '../config/constants';
import { Task } from 'src/database/models';
import { CreateTask, UpdateTask } from './dto';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    private customLogger: CustomLogger,
  ) {}
  findAll(userId: number) {
    try {
      this.customLogger.log('findAll');
      return this.taskRepository.findAll({
        where: {
          userId,
        },
      });
    } catch (error) {
      this.customLogger.error(error);
      throw error;
    }
  }
  async findOne(id: number, userId: number) {
    try {
      this.customLogger.log('findOne');
      const task = await this.taskRepository.findOne({
        where: { id, userId },
      });

      if (!task) throw new NotFoundException();
      return task;
    } catch (error) {
      this.customLogger.error(error);
      throw error;
    }
  }
  create(createTask: CreateTask, userId: number) {
    try {
      this.customLogger.log('create');
      return this.taskRepository.create({
        ...createTask,
        userId,
      });
    } catch (error) {
      this.customLogger.error(error);
      throw error;
    }
  }
  async remove(id: number, userId: number) {
    try {
      this.customLogger.log('remove');
      await this.findOne(id, userId);
      return this.taskRepository.destroy({ where: { id, userId } });
    } catch (error) {
      this.customLogger.error(error);
      throw error;
    }
  }
  async update(updateTask: UpdateTask, id: number, userId: number) {
    try {
      this.customLogger.log('update');
      await this.findOne(id, userId);
      const updatedData = await this.taskRepository.update(
        { ...updateTask },
        { where: { id, userId }, returning: true },
      );
      return updatedData;
    } catch (error) {
      this.customLogger.error(error);
      throw error;
    }
  }
}

import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TASK_REPOSITORY } from '../config/envConstants';
import { Task } from 'src/database/models';
import { CreateTask, UpdateTask } from './dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
  ) {}
  findAll(userId: number) {
    return this.taskRepository.findAll({
      where: {
        userId,
      },
    });
  }
  async findOne(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) throw new NotFoundException();
    return task;
  }
  create(createTask: CreateTask, userId: number) {
    return this.taskRepository.create({
      ...createTask,
      userId,
    });
  }
  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.taskRepository.destroy({ where: { id, userId } });
  }
  async update(updateTask: UpdateTask, id: number, userId: number) {
    await this.findOne(id, userId);
    const updatedData = await this.taskRepository.update(
      { ...updateTask },
      { where: { id, userId }, returning: true },
    );
    return updatedData;
  }
}

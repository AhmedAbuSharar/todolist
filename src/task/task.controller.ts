import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/decorator';
import { CreateTask, UpdateTask } from './dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
    return this.taskService.findOne(id, userId);
  }
  @Get()
  findAll(@User('id') userId: number) {
    return this.taskService.findAll(userId);
  }
  @Post()
  create(@Body() createTask: CreateTask, @User('id') userId: number) {
    return this.taskService.create(createTask, userId);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTask: UpdateTask,
    @User('id') userId: number,
  ) {
    return this.taskService.update(updateTask, id, userId);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
    return this.taskService.remove(id, userId);
  }
}

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
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, TransactionParam } from '../common/decorator';
import { CreateTask, UpdateTask } from './dto';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';

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

  @UseInterceptors(TransactionInterceptor)
  @Post()
  create(
    @Body() createTask: CreateTask,
    @User('id') userId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.taskService.create(createTask, userId, transaction);
  }

  @UseInterceptors(TransactionInterceptor)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTask: UpdateTask,
    @User('id') userId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.taskService.update(updateTask, id, userId, transaction);
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.taskService.remove(id, userId, transaction);
  }
}

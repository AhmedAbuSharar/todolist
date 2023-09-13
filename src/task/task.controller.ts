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
  Inject,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, TransactionParam } from '../common/decorator';
import { CreateTask, UpdateTask } from './dto';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MyGateway } from './task.gateway';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject(MyGateway)
    private readonly myGateway: MyGateway,
  ) {}
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

  @Cron(CronExpression.EVERY_MINUTE)
  @UseInterceptors(TransactionInterceptor)
  async handleCron(@TransactionParam() transaction: Transaction) {
    const { updatedCount, tasksUpdated } =
      await this.taskService.expired(transaction);
    if (updatedCount) this.myGateway.server.emit('tasksExpired', tasksUpdated);
    return { success: true };
  }
}

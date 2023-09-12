import { PartialType } from '@nestjs/mapped-types';
import { CreateTask } from './createTask.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from 'src/common/enum';

export class UpdateTask extends PartialType(CreateTask) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: string;
}

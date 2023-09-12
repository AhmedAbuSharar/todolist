import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTask {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  content: string;
}

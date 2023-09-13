import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { TaskService } from './task.service';
import { CustomLogger } from 'src/common/logger/logger.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TASK_REPOSITORY, jwtConstants } from '../common/constants';
import { Task } from 'src/database/models';

@WebSocketGateway()
export class MyGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    private readonly taskService: TaskService,
    private customLogger: CustomLogger,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.customLogger.log('WebSocket Gateway initialized');
  }

  handleDisconnect(client: Socket) {
    this.customLogger.log(`Client disconnected: ${client.id}`);
  }

  private async sendAllTasks(client: Socket) {
    this.customLogger.log('in sendAllTasks');
    this.customLogger.log(`Client connected: ${client.id}`);
    const token: string = client.handshake.headers.token?.toString();
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const tasks = await this.taskService.findAll(payload.id);
      this.server.emit('allTasks', tasks);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @SubscribeMessage('events')
  async onEvent(client: Socket, message: string) {
    await this.sendAllTasks(client);
    return { data: 'onEvent done' };
  }
}

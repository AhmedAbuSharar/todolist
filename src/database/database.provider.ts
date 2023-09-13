import { SEQUELIZE, DATABASE } from '../common/constants';

import { Sequelize } from 'sequelize-typescript';
import { Task, User } from './models';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const sequalize = new Sequelize({
        ...configService.get(DATABASE),
      });

      sequalize.addModels([Task, User]);

      return sequalize;
    },
    inject: [ConfigService],
  },
];

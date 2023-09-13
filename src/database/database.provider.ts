import { SEQUELIZE } from '../common/constants';

import { Sequelize } from 'sequelize-typescript';
import { Task, User } from './models';
import { AppConfigService } from 'config/config.service';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: AppConfigService) => {
      const sequalize = new Sequelize(configService.sequelizeConfig);

      sequalize.addModels([Task, User]);

      return sequalize;
    },
    inject: [AppConfigService],
  },
];

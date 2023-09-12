import { PRODUCTION, TEST } from '../config/envConstants';

import { Sequelize } from 'sequelize-typescript';
import { Task, User } from './models';

const { production, test, development } = require('./config/config');

export const databaseProviders = [
  {
    provide: 'sequalize',
    useFactory: async () => {
      let config;
      if (process.env.NODE_ENV === PRODUCTION) {
        config = production;
      } else if (process.env.NODE_ENV === TEST) {
        config = test;
      } else {
        config = development;
      }

      const sequalize = new Sequelize(config);

      sequalize.addModels([Task, User]);

      await sequalize.sync();

      return sequalize;
    },
  },
];
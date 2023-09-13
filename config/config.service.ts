import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PRODUCTION, TEST, NODE_ENV } from 'src/common/constants';
const { production, test, development } = require('./config');

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get sequelizeConfig() {
    const nodeEnv = this.configService.get(NODE_ENV);
    switch (nodeEnv) {
      case PRODUCTION:
        return production;
      case TEST:
        return test;
      default:
        return development;
    }
  }
}

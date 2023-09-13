const { config } = require('dotenv');

config();

import { config as defaultConfig } from './config.development';

const env = process.env.NODE_ENV || 'development';
const filePath = `config.${env}`;

const { config: currentConfig } = require(`./${filePath}`);

export default [currentConfig ?? defaultConfig];

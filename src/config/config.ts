import Joi, { Schema } from 'joi';
import dotenv from 'dotenv';
import { get, isEqual, map } from 'lodash';
import path from 'path';
import { IConfiguration, IValidate } from './interfaces';

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

// Define the schema for the environment variables
const envVarsSchema: Schema = Joi.object({
  LOG_FILE_DAY: Joi.string().description('Log file day'),
  LOG_FILE_ENABLE: Joi.string().description('Log file enable'),
  LOG_FILE_NAME: Joi.string().description('Log file name'),
  LOG_FILE_SIZE: Joi.string().description('Log file size'),
  LOG_FILE_ZIP_ARCHIVE: Joi.string().description('Log file zip archive'),
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Application environment'),
  PORT: Joi.number().default(4000),
}).unknown();

// Validate and extract environment variables
const { value: envVars, error } = envVarsSchema.validate(process.env, {
  errors: { label: 'key' },
}) as IValidate;

// Throw an error if validation fails
if (error) {
  const errorMessage: string = map(get(error, 'details'), 'message').join(', ');

  throw new Error(`Config validation error: ${errorMessage}`);
}

// Build the configuration object
const appConfiguration: IConfiguration = {
  env: get(envVars, 'NODE_ENV'),
  log: {
    day: get(envVars, 'LOG_FILE_DAY', '14d'),
    isEnable: isEqual(get(envVars, 'LOG_FILE_ENABLE', 'false'), 'true'),
    name: get(envVars, 'LOG_FILE_NAME', 'pmp.service'),
    size: get(envVars, 'LOG_FILE_SIZE', '20m'),
    zippedArchive: isEqual(get(envVars, 'LOG_FILE_ZIP_ARCHIVE', 'false'), 'true'),
  },
  port: get(envVars, 'PORT'),
};

export default appConfiguration;

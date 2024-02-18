import { ValidationError } from 'joi';

// Define the IValidate interface for validation results
export interface IValidate {
  value: IEnvVars;
  error: ValidationError;
}

// Define the IEnvVars interface
export interface IEnvVars {
  LOG_FILE_DAY?: string;
  LOG_FILE_ENABLE?: string;
  LOG_FILE_NAME?: string;
  LOG_FILE_SIZE?: string;
  LOG_FILE_ZIP_ARCHIVE?: string;
  NODE_ENV: string;
  PORT: number;
}

// Define the IConfiguration interface
export interface IConfiguration {
  env: string;
  log: {
    day: string;
    isEnable: boolean;
    name: string;
    size: string;
    zippedArchive: boolean;
  };
  port: number;
}

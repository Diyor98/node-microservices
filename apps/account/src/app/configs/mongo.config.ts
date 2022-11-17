import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

const getMongoString = (config: ConfigService) =>
  'mongodb://' +
  config.get('MONGO_LOGIN') +
  ':' +
  config.get('MONGO_PASSWORD') +
  '@' +
  config.get('MONGO_HOST') +
  ':' +
  config.get('MONGO_PORT') +
  '/' +
  config.get('MONGO_DATABASE') +
  '?authSource=' +
  config.get('MONGO_AUTHDATABASE');

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (config: ConfigService) => ({
      uri: getMongoString(config),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    exchangeName: config.get('AMQP_EXCHANGE') ?? '',
    connections: [
      {
        login: config.get('AMQP_USER') ?? '',
        password: config.get('AMQP_PASSWORD') ?? '',
        host: config.get('AMQP_HOSTNAME') ?? '',
      },
    ],
    prefetchCount: 32,
    serviceName: 'purple-account',
  }),
});

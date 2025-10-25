import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongoDatabase } from './mongo.database';

export const MONGO_DATABASE_PROVIDER = 'MONGO_DATABASE_PROVIDER';

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        {
          provide: MONGO_DATABASE_PROVIDER,
          useFactory: async (configService: ConfigService) => {
            let mongoURIDefault = `mongodb://${configService.get('mongodb.host')}:${configService.get('mongodb.port')}?retryWrites=false`;
            // if (!configService.get('isE2E')) {
            //   mongoURIDefault = `${mongoURIDefault}&tls=true&tlsCAFile=global-bundle.pem`;
            // }
            const mongoDatabase = new MongoDatabase(
              mongoURIDefault,
              configService.get('mongodb.schema') || '',
            );

            await mongoDatabase.startConnection();

            return mongoDatabase;
          },
          inject: [ConfigService],
        },
      ],
      exports: [MONGO_DATABASE_PROVIDER],
    };
  }
}

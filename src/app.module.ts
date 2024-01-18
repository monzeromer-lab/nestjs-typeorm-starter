import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE') as 'mysql',
        host: configService.get('DATABASE_HOST') as string,
        port: configService.get('DATABASE_PORT') as number,
        username: configService.get('DATABASE_USERNAME') as string,
        password: configService.get('DATABASE_PASSWORD') as string,
        database: configService.get('DATABASE_NAME') as string,
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        migrations: ["dist/migrations/*{.ts,.js}"],
      }),
    }),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/*
type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'demo',
      entities: [Todo],
      synchronize: true,
*/

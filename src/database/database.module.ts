import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'exe_authlogin-nest',
      bigNumberStrings: false,
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}

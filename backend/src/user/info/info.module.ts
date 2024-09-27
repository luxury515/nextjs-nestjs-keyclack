import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { TcusCustM } from './info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TcusCustM])],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}

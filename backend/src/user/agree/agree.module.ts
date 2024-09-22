import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreeController } from './agree.controller';
import { AgreeService } from './agree.service';
import { Agree } from './agree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agree])],
  controllers: [AgreeController],
  providers: [AgreeService],
})
export class AgreeModule {}
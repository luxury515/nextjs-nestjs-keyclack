import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agree } from './agree.entity';
import { Like } from 'typeorm';

@Injectable()
export class AgreeService {
  constructor(
    @InjectRepository(Agree)
    private readonly agreeRepository: Repository<Agree>,
  ) {}

  findAll(): Promise<Agree[]> {
    return this.agreeRepository.find();
  }

  async findOne(cust_nm: string, tmcnd_plcy_cls_cd: string): Promise<Agree[]> {
    const whereCondition = {};
    if (cust_nm) {
      whereCondition['cust_nm'] = Like(`%${cust_nm}%`);
    }
    if (tmcnd_plcy_cls_cd) {
      whereCondition['tmcnd_plcy_cls_cd'] = tmcnd_plcy_cls_cd;
    }

    return this.agreeRepository.find({
      where: whereCondition,
    });
  }

  async update(cust_nm: string, agre_yn: boolean , tmcnd_plcy_cls_cd: string): Promise<void> {
    const agreYnValue = agre_yn ? 'Y' : 'N';
    await this.agreeRepository.update(
      { cust_nm, tmcnd_plcy_cls_cd },
      { agre_yn: agreYnValue }
    );
  }
}
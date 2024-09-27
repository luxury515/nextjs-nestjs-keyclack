import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,Like } from 'typeorm';
import { Agree } from './agree.entity';

@Injectable()
export class AgreeService {
  constructor(
    @InjectRepository(Agree)
    private readonly agreeRepository: Repository<Agree>,
  ) {}

  async search(cust_nm: string, policyCode: string, skip: number, take: number): Promise<[Agree[], number]> {
    const query = this.agreeRepository.createQueryBuilder('agree')
      .where('agree.cust_nm LIKE :cust_nm', { cust_nm: `%${cust_nm}%` })
      .andWhere('agree.tmcnd_plcy_cls_cd IS NOT NULL');

    if (policyCode) {
      query.andWhere('agree.tmcnd_plcy_cls_cd = :policyCode', { policyCode });
    }

    const [data, total] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [data, total];
  }

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
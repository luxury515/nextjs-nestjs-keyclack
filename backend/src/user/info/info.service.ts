import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TcusCustM } from './info.entity';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(TcusCustM)
    private tcusCustMRepository: Repository<TcusCustM>,
  ) {}

  async findAll(
    cust_no?: string,
    cust_nm?: string,
    cust_cls_cd?: string,
    cust_stat_cd?: string,
    hp?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: TcusCustM[]; total: number }> {
    const query = this.tcusCustMRepository.createQueryBuilder('tcus_cust_m');

    if (cust_no) {
      query.andWhere('tcus_cust_m.cust_no = :cust_no', { cust_no });
    }
    if (cust_nm) {
      query.andWhere('tcus_cust_m.cust_nm LIKE :cust_nm', { cust_nm: `%${cust_nm}%` });
    }
    if (cust_cls_cd) {
      query.andWhere('tcus_cust_m.cust_cls_cd = :cust_cls_cd', { cust_cls_cd });
    }
    if (cust_stat_cd) {
      query.andWhere('tcus_cust_m.cust_stat_cd = :cust_stat_cd', { cust_stat_cd });
    }
    if (hp) {
      query.andWhere('tcus_cust_m.hp LIKE :hp', { hp: `%${hp}%` });
    }

    query.select(['tcus_cust_m.cust_no', 'tcus_cust_m.cust_nm', 'tcus_cust_m.cust_cls_cd', 'tcus_cust_m.cust_stat_cd', 'tcus_cust_m.hp']);

    const total = await query.getCount();

    query.skip((page - 1) * limit).take(limit);

    const data = await query.getMany();

    return { data, total };
  }
}

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

  async getUsers({
    page = 1,
    limit = 10,
    cust_nm,
    eml,
    hp,
    cust_cls_cd_array = [],
    jon_typ_cd_array = [],
    cust_stat_cd_array = [],
  }: {
    page?: number;
    limit?: number;
    cust_no?: string;
    cust_id?: string;
    cust_nm?: string;
    eml?: string;
    hp?: string;
    cust_cls_cd_array?: string[];
    jon_typ_cd_array?: string[];
    cust_stat_cd_array?: string[];
  }): Promise<{ data: TcusCustM[]; total: number }> {
    const query = this.tcusCustMRepository.createQueryBuilder('tcus_cust_m');

    if (eml) {
      query.andWhere('tcus_cust_m.email LIKE :email', { email: `%${eml}%` });
    }
    if (hp) {
      query.andWhere('tcus_cust_m.hp LIKE :hp', { hp: `%${hp}%` });
    }
    if (cust_nm) {
      query.andWhere('tcus_cust_m.cust_nm LIKE :cust_nm', { cust_nm: `%${cust_nm}%` });
    }
    if (cust_cls_cd_array.length > 0) {
      query.andWhere('tcus_cust_m.cust_cls_cd IN (:...cust_cls_cd_array)', { cust_cls_cd_array });
    }
    if (cust_stat_cd_array.length > 0) {
      query.andWhere('tcus_cust_m.cust_stat_cd IN (:...cust_stat_cd_array)', { cust_stat_cd_array });
    }
    if (jon_typ_cd_array.length > 0) {
      query.andWhere('tcus_cust_m.jon_typ_cd IN (:...jon_typ_cd_array)', { jon_typ_cd_array });
    }

    query.select([
      'tcus_cust_m.cust_no',
      'tcus_cust_m.cust_nm',
      'tcus_cust_m.eml',
      'tcus_cust_m.cust_cls_cd',
      'tcus_cust_m.cust_stat_cd',
      'tcus_cust_m.hp',
      'tcus_cust_m.join_typ_cd',
      'tcus_cust_m.join_ymd'
    ]);

    console.log('Generated SQL:', query.getQuery());

    const total = await query.getCount();

    query.skip((page - 1) * limit).take(limit);

    const data = await query.getMany();

    const formattedData = data.map(item => ({
      ...item,
      join_ymd: new Date(item.join_ymd)
    }));

    console.log('Retrieved data:', formattedData);

    return {
      data: formattedData,
      total
    };
  }
}

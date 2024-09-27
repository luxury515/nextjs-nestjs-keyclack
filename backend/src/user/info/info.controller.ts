import { Controller, Post, Body, Query } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('user/info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post()
  async getUsers(
    @Body() body: {
      cust_nm?: string;
      eml?: string;
      hp?: string;
      cust_cls_cd?: string[];
      cust_stat_cd?: string[];
      jon_typ_cd?: string[];
    },
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const {
      cust_nm,
      eml,
      hp,
      cust_cls_cd: cust_cls_cd_array = [],
      jon_typ_cd: jon_typ_cd_array = [],
      cust_stat_cd: cust_stat_cd_array = []
    } = body;

    // 모든 필터 조건이 비어있는지 확인
    const isAllEmpty = !cust_nm && !eml && !hp && 
      cust_cls_cd_array.length === 0 && 
      jon_typ_cd_array.length === 0 && 
      cust_stat_cd_array.length === 0;

    // 전체 조회 조건일 경우 빈 객체 전달
    const filterConditions = isAllEmpty ? {} : {
      cust_nm,
      eml,
      hp,
      cust_cls_cd_array,
      jon_typ_cd_array,
      cust_stat_cd_array,
    };

    return this.infoService.getUsers({
      ...filterConditions,
      page: pageNumber,
      limit: limitNumber,
    });
  }
}

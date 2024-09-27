import { Controller, Get, Query } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  async findAll(
    @Query('cust_no') cust_no?: string,
    @Query('cust_nm') cust_nm?: string,
    @Query('cust_cls_cd') cust_cls_cd?: string,
    @Query('cust_stat_cd') cust_stat_cd?: string,
    @Query('hp') hp?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.infoService.findAll(
      cust_no,
      cust_nm,
      cust_cls_cd,
      cust_stat_cd,
      hp,
      +page,
      +limit
    );
  }
}

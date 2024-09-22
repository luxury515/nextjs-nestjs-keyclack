import { Controller, Get, Put, Query, Body, Post } from '@nestjs/common';
import { AgreeService } from './agree.service';
import { Agree } from './agree.entity';
import { UpdateAgreeDto } from './agree.dto';

@Controller('user/agree')
export class AgreeController {
  constructor(private readonly agreeService: AgreeService) {}

  @Get()
  findAll(): Promise<Agree[]> {
    return this.agreeService.findAll();
  }

  @Post('search')
  findOne(@Body() body: { cust_nm: string, tmcnd_plcy_cls_cd: string }): Promise<Agree[]> {
    const { cust_nm, tmcnd_plcy_cls_cd } = body;
    const policyCode = tmcnd_plcy_cls_cd === 'ALL' ? '' : tmcnd_plcy_cls_cd;
    return this.agreeService.findOne(cust_nm, policyCode);
  }

  @Put()
  update(@Body() updateAgreeDto: UpdateAgreeDto): Promise<void> {
    const { cust_nm, agre_yn, tmcnd_plcy_cls_cd } = updateAgreeDto;
    return this.agreeService.update(cust_nm, agre_yn, tmcnd_plcy_cls_cd);
  }
}
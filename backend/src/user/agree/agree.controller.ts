import { Controller, Post, Body, Query, Put } from '@nestjs/common';
import { AgreeService } from './agree.service';
import { Agree } from './agree.entity';
import { UpdateAgreeDto } from './agree.dto';

@Controller('user/agree')
export class AgreeController {
  constructor(private readonly agreeService: AgreeService) {}

  @Post('search')
  async search(
    @Body() body: { cust_nm: string; tmcnd_plcy_cls_cd: string },
    @Query('pageSize') pageSize: number = 10,
    @Query('page') page: number = 1
  ): Promise<{ data: Agree[]; total: number }> {
    const { cust_nm, tmcnd_plcy_cls_cd } = body;
    console.log('search----->{}',cust_nm);
    console.log('search----->{}',tmcnd_plcy_cls_cd);
    const policyCode = tmcnd_plcy_cls_cd === 'ALL' ? '' : tmcnd_plcy_cls_cd;
    
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.agreeService.search(cust_nm, policyCode, skip, pageSize);
    
    return { data, total };
  }

  @Put()
  update(@Body() updateAgreeDto: UpdateAgreeDto): Promise<void> {
    const { cust_nm, agre_yn, tmcnd_plcy_cls_cd } = updateAgreeDto;
    return this.agreeService.update(cust_nm, agre_yn, tmcnd_plcy_cls_cd);
  }
}
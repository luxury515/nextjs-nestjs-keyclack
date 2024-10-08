import { Controller, Get, Post, Put, Body, Param, Query, Headers, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { UpdateBlogDto } from './blog.dto';
import { publicDecrypt } from 'crypto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.blogService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  async create(@Body() blogData: Partial<Blog>, @Headers('Authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.blogService.create(blogData, token);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() blogData: UpdateBlogDto, @Headers('Authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.blogService.update(id, blogData, token);
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('Authorization') authHeader: string) {
    console.log("delete blog id----->",id);
    const token = authHeader.split(' ')[1];
    return this.blogService.delete(id, token);
  }
}

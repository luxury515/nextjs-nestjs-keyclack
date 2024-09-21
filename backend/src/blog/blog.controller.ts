import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { UpdateBlogDto } from './blog.dto';

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

  private parseToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() blogData: UpdateBlogDto) {
    return this.blogService.update(id, blogData);
  }
}
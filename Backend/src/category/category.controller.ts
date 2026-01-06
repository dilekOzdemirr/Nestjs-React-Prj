import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // Varsayılan kategorileri oluştur
  @Post('seed')
  async seed() {
    const defaultCategories = ['Müzik', 'Spor', 'Film', 'Teknoloji', 'Psikoloji', 'Sağlık'];
    const results: { name: string; status: string; id?: number; message?: string }[] = [];

    for (const name of defaultCategories) {
      try {
        const existing = await this.categoryService.findByName(name);
        if (!existing) {
          const created = await this.categoryService.create({ name });
          results.push({ name, status: 'created', id: created.id });
        } else {
          results.push({ name, status: 'exists', id: existing.id });
        }
      } catch (error) {
        results.push({ name, status: 'error', message: error.message });
      }
    }

    return { message: 'Seed tamamlandı', categories: results };
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Bunu ekle
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity'; // <-- Entity'ni import et

@Module({
  // Burası boş gelir, içine TypeOrmModule satırını ekle:
  imports: [TypeOrmModule.forFeature([Category])], 
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
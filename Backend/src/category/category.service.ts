import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  // Kategori Oluşturma
  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  // Tüm Kategorileri Getirme
  findAll() {
    return this.categoryRepository.find();
  }

  // ID ile Tek Kategori Getirme
  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  // İsme göre kategori bul
  findByName(name: string) {
    return this.categoryRepository.findOne({ where: { name } });
  }

  // Güncelleme
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  // Silme
  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}

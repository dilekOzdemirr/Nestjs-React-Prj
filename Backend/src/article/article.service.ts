import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './article.entity';
import { Category } from '../category/category.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) { }

  // --- MAKALE OLUŞTURMA ---
  async create(createArticleDto: CreateArticleDto) {
    // 1. Yazar kontrolü
    const author = await this.profileRepository.findOneBy({ id: createArticleDto.authorId });
    if (!author) {
      throw new NotFoundException('Böyle bir yazar bulunamadı!');
    }

    // 2. Kategorileri bul (yeni çoklu format veya eski tekli format)
    let categories: Category[] = [];

    if (createArticleDto.categoryIds && createArticleDto.categoryIds.length > 0) {
      // Yeni format: birden fazla kategori
      categories = await this.categoryRepository.find({
        where: { id: In(createArticleDto.categoryIds) }
      });
    } else if (createArticleDto.categoryId) {
      // Eski format: tek kategori
      const category = await this.categoryRepository.findOneBy({ id: createArticleDto.categoryId });
      if (category) {
        categories = [category];
      }
    }

    if (categories.length === 0) {
      throw new NotFoundException('En az bir kategori seçilmelidir!');
    }

    // 3. Makaleyi oluştur
    const newArticle = this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      image: createArticleDto.image,
      author: author,
      categories: categories,
    });

    // 4. Kaydet
    return this.articleRepository.save(newArticle);
  }

  // --- TÜM MAKALELERİ GETİR ---
  findAll() {
    return this.articleRepository.find({
      relations: ['author', 'categories'],
      order: { id: 'DESC' },
    });
  }

  // --- TEK BİR MAKALE GETİR ---
  findOne(id: number) {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'categories', 'comments', 'comments.author'],
    });
  }

  // --- GÜNCELLEME ---
  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!article) {
      throw new NotFoundException('Makale bulunamadı!');
    }

    // Kategorileri güncelle
    if (updateArticleDto.categoryIds && updateArticleDto.categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(updateArticleDto.categoryIds) }
      });
      article.categories = categories;
    }

    // Diğer alanları güncelle
    if (updateArticleDto.title) article.title = updateArticleDto.title;
    if (updateArticleDto.content) article.content = updateArticleDto.content;
    if (updateArticleDto.image !== undefined) article.image = updateArticleDto.image;

    return this.articleRepository.save(article);
  }

  // --- SİLME ---
  remove(id: number) {
    return this.articleRepository.delete(id);
  }
}
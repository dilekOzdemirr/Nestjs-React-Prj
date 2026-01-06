import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { Category } from '../category/category.entity'; // <-- İlişki için lazım
import { Profile } from '../profiles/entities/profile.entity'; // <-- Yazar için lazım

@Module({
  imports: [
    // Bu modülde 3 tabloyu birden kullanacağız:
    TypeOrmModule.forFeature([Article, Category, Profile])
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
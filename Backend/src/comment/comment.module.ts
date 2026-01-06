import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity'; // <-- Ekle
import { Profile } from '../profiles/entities/profile.entity'; // <-- Ekle

@Module({
  imports: [
    // 3 tabloyu da kullanacağız
    TypeOrmModule.forFeature([Comment, Article, Profile])
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
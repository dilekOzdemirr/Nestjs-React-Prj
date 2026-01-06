import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  // YORUM EKLEME
  async create(createCommentDto: CreateCommentDto) {
    // 1. Makale var mı?
    const article = await this.articleRepository.findOneBy({ id: createCommentDto.articleId });
    if (!article) throw new NotFoundException('Makale bulunamadı!');

    // 2. Yazar var mı?
    const author = await this.profileRepository.findOneBy({ id: createCommentDto.authorId });
    if (!author) throw new NotFoundException('Yazar bulunamadı!');

    // 3. Yorumu oluştur ve bağla
    const newComment = this.commentRepository.create({
      content: createCommentDto.content,
      article: article,
      author: author,
    });

    return this.commentRepository.save(newComment);
  }

  // TÜM YORUMLARI GETİR (İlişkilerle beraber)
  findAll() {
    return this.commentRepository.find({
      relations: ['article', 'author'], // Hangi makaleye kim yazmış görelim
    });
  }

  findOne(id: number) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['article', 'author'],
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
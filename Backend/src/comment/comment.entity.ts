import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';
import { Profile } from '../profiles/entities/profile.entity'; 

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string; // Yorum metni

  // İlişki: Bir yorum bir makaleye aittir
  @ManyToOne(() => Article, (article) => article.comments, { onDelete: 'CASCADE' })
  article: Article;

  // İlişki: Bir yorumu bir Profil (Kullanıcı) yazar
  @ManyToOne(() => Profile, (profile) => profile.comments) 
  author: Profile;
}
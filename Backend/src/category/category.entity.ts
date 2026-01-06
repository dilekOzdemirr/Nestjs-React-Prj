import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Örn: Teknoloji, Spor

  // Çoka-Çok İlişki: Bir kategoride birden fazla makale olabilir
  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
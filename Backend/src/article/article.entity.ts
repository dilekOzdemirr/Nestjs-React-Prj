import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string; // Makale görseli

  // İlişki: Makaleyi bir Profil (Yazar) yazar
  @ManyToOne(() => Profile, (profile) => profile.articles)
  author: Profile;

  // İlişki: Makalenin kategorileri (Çoka-Çok)
  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable() // Bu tablo ara ilişkiyi yönetir (Mutlaka olmalı!)
  categories: Category[];

  // İlişki: Makalenin yorumları
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
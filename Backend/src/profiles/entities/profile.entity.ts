import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ProfileType } from './profile-type.entity';
import { Article } from '../../article/article.entity';
import { Comment } from '../../comment/comment.entity';

// Kullanıcı rolleri
export enum UserRole {
  WRITER = 'writer',
  READER = 'reader'
}

//gerçek kişi profili tablosu
@Entity()
export class Profile {
  @PrimaryGeneratedColumn() // Otomatik ID üretimi
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true }) // Foto URL sakla
  photo: string;

  @Column({ type: 'text', default: UserRole.READER })
  role: UserRole;

  @ManyToOne(() => ProfileType, (profileType) => profileType.profiles, { nullable: true })
  profileType: ProfileType;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
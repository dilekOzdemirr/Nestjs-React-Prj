import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileType } from './profile-type.entity';
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

  @Column() // Foto URL sakla
  photo: string;
    profileType: any;
}
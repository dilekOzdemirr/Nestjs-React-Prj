import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';

@Entity() // bu bir veritabanı tablosu
export class ProfileType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; //öğrenci,öğretmen, falan

  // Bir ProfileType'ın birden çok Profili olabilir
  @OneToMany(() => Profile, (profile) => profile.profileType)
  profiles: Profile[];
}
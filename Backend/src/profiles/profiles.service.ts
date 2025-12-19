import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProfilesService {
  constructor(  //veritabanı ile konuşan araç
    @InjectRepository(Profile) //profile tablosunun kütüphanesini repositoryi dpo al
    private profileRepository: Repository<Profile>,
  ) {}

  private deleteFile(photoUrl: string) {
    if (!photoUrl) return;
    
    const parts = photoUrl.split('/');
    const fileName = parts[parts.length - 1]; 

    if (!fileName) return;

    const filePath = join(process.cwd(), 'uploads', fileName);
     //bu komjutlar tam doysa yolu ister
    if (fs.existsSync(filePath)) { //dosya orda mı kontrol et
      try {
        fs.unlinkSync(filePath); //dosyayı sil
      } catch (err) {
        console.log("Dosya silinemedi:", err);
      }
    }
  }


  async create(createProfileDto: CreateProfileDto, photoUrl: string) {
               //createProfileDTO doldurulan dosya gibi düşün 
    if (createProfileDto.password !== createProfileDto.confirmPassword) {
      throw new BadRequestException('Hata: Şifreler uyuşmuyor!');
    }

   const newProfile = this.profileRepository.create({ //yeni bir orfil oluşturulur ama kaydete basılmadığından henüz db ye kaydedilmez
      ...createProfileDto, //yeni profil oluşturulurken dto dan gelen veriler 
      photo: photoUrl,
      profileType: { id: +createProfileDto.profileTypeId } // İlişkiyi ID üzerinden kuruyoruz
    });

    return this.profileRepository.save(newProfile); //veritabanına kaydet
  }

  findAll() {
    return this.profileRepository.find();
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) throw new NotFoundException('Profil bulunamadı');
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, newPhotoUrl?: string) {
    const profile = await this.findOne(id);//önce eski profili bulur

    if (newPhotoUrl) { //yeni fotoğraf varsa eskiyi sil 
      this.deleteFile(profile.photo);
      profile.photo = newPhotoUrl;
    }

    Object.assign(profile, updateProfileDto); //yeni bilgileri üzerine yaz
    return this.profileRepository.save(profile); //kaydet
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    this.deleteFile(profile.photo);
    return this.profileRepository.remove(profile);
  }
}
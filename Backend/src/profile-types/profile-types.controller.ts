import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileType } from '../profiles/entities/profile-type.entity';

@Controller('profileTypes')  //profil tipi tablosu burada yönetilir
export class ProfileTypesController {
  constructor(
    @InjectRepository(ProfileType)
    private profileTypeRepository: Repository<ProfileType>,
  ) {}

  @Get()
  findAll() {
    return this.profileTypeRepository.find();
  }
  
  
  //geçici endpoint profil tiplerini eklemek için
  @Get('seed')
  async seed() {
      const types = ['Admin', 'Personel', 'Müşteri'];
      for(const t of types){
          const exists = await this.profileTypeRepository.findOne({where: {name: t}});
          if(!exists) {
             const newType = this.profileTypeRepository.create({name: t});
             await this.profileTypeRepository.save(newType);
          }
      }
      return "Profile Tipleri Eklendi";
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity'; 

@Module({
  imports: [  //typeorm un profile tablosunu bilmesi lazım ki repository üretsin
    TypeOrmModule.forFeature([Profile])  //NestJS, Profile tablosu için bir Repository üretir
  ], //servis ve controller ı tek bir modülde birleştiriyoruz
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
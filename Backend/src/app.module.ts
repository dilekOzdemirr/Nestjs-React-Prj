import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from './profiles/entities/profile.entity';
import { ProfileType } from './profiles/entities/profile-type.entity'; 
import { ProfileTypesController } from './profile-types/profile-types.controller';
//projenin ana modülü yani ana kumanda merkezi burasıdır
@Module({
  imports: [
    // Database ayarları
    TypeOrmModule.forRoot({
      type: 'sqlite',   //hangi veritabanı motoru kullanılacak
      database: 'db.sqlite',  //Dosyanın adı ne olacak
      entities: [Profile, ProfileType],   //hangi tablolar var 
      synchronize: true,    //otomatik tablo senkronizasyonu
    }),
    
    // Resimlerin tarayıcıda erişilebilmesi için statik bir yol
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),  //dosyalar bilgisayarda nerede
      serveRoot: '/uploads',  //tarayıcıda hangi yoldan erişilecek
    }),
    TypeOrmModule.forFeature([ProfileType]),
    ProfilesModule,
  ],
  controllers: [ProfileTypesController],
})
export class AppModule {}
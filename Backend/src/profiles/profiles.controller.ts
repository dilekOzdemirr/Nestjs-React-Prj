import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileCleanupInterceptor } from './file-cleanup.interceptor'; 
//veriyi alma işi yapması için service e devretme
const storageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('profiles')  // her şey https://localhost:3000/profiles başlar ana rotamızz
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', { storage: storageConfig }), // dosyanın adını rand karakterlerle yükler ki diğerleriyle karışmasın
    FileCleanupInterceptor 
  )   //body  json verisini createprofiledto şeklinde bana ver  //photoyu verilen dosyadan al 
  create(@Body() createProfileDto: CreateProfileDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fotoğraf yüklemek zorunludur!');
    }
    //dosyanın url sini oluştur
    const photoUrl = `http://localhost:3000/uploads/${file.filename}`;

    return this.profilesService.create(createProfileDto, photoUrl);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id') //id kısmını kes bana ver
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id') //Güncelleme işlemi
  @UseInterceptors(
    FileInterceptor('photo', { storage: storageConfig }), //yeni foto yükleniyor olabilir
    FileCleanupInterceptor 
  )
  async update(
    @Param('id') id: string,  //biri güncelleme isterse id yi al
    @Body() updateProfileDto: UpdateProfileDto,  //gönderilen body i dto ya çevir
    @UploadedFile() file: Express.Multer.File //yeni fotoğraf var mı kontrol et 
  ) {
    let photoUrl: string | undefined = undefined; 
   //kullanıcı sadece ismini değiştirebilir
    if (file) {
      photoUrl = `http://localhost:3000/uploads/${file.filename}`;
    }

    return this.profilesService.update(+id, updateProfileDto, photoUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
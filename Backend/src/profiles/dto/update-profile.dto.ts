import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
//createProfileDto içindeki tüm alanları kopyalar partial yapar , yani zorunluluklar kalkar sadece istenen güncellenir
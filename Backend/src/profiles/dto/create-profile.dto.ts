import { IsString, IsEmail, Matches, IsNotEmpty, IsNumberString } from 'class-validator';
//validation doğrulama kuralları
export class CreateProfileDto {
  @IsNotEmpty() 
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail() 
  email: string;

  @IsNotEmpty()
  @Matches(//en az rakam sembol     büyük        küçük 
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'Şifre en az 1 büyük harf, 1 küçük harf, 1 sayı ve 1 sembol içermelidir.' }
  ) // regex
  password: string;

  @IsNotEmpty()
  confirmPassword: string; 

  @IsNotEmpty()
  // Frontend'den form-data ile gelirken string gelebilir,controllerda çeviriyrz
  // basitleştirmek için şimdilik IsNotEmpty yeterli.
  profileTypeId: string;
}
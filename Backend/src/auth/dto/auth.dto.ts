import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength, Matches } from 'class-validator';
import { UserRole } from '../../profiles/entities/profile.entity';

export class RegisterDto {
    @IsNotEmpty({ message: 'Kullanıcı adı zorunludur' })
    username: string;

    @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
    email: string;

    @IsNotEmpty({ message: 'Şifre zorunludur' })
    @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message: 'Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir',
    })
    password: string;

    @IsEnum(UserRole, { message: 'Rol writer veya reader olmalıdır' })
    role: UserRole;

    @IsOptional()
    profileTypeId?: number;
}

export class LoginDto {
    @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
    email: string;

    @IsNotEmpty({ message: 'Şifre zorunludur' })
    password: string;
}

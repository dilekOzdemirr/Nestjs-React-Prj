import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from '../profiles/entities/profile.entity';
import { ProfileType } from '../profiles/entities/profile-type.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(ProfileType)
        private profileTypeRepository: Repository<ProfileType>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        // Email kontrolü
        const existingUser = await this.profileRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Bu email adresi zaten kayıtlı');
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // ProfileType bul (opsiyonel)
        let profileType: ProfileType | undefined = undefined;
        if (registerDto.profileTypeId) {
            const foundType = await this.profileTypeRepository.findOne({
                where: { id: registerDto.profileTypeId },
            });
            if (foundType) {
                profileType = foundType;
            }
        }

        // Yeni kullanıcı oluştur
        const user = this.profileRepository.create({
            username: registerDto.username,
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role,
            profileType: profileType,
        });

        await this.profileRepository.save(user);

        // Token oluştur ve döndür
        const token = this.generateToken(user);

        return {
            message: 'Kayıt başarılı',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            access_token: token,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.profileRepository.findOne({
            where: { email: loginDto.email },
            relations: ['profileType'],
        });

        if (!user) {
            throw new UnauthorizedException('Email veya şifre hatalı');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email veya şifre hatalı');
        }

        const token = this.generateToken(user);

        return {
            message: 'Giriş başarılı',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                photo: user.photo,
            },
            access_token: token,
        };
    }

    private generateToken(user: Profile): string {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }

    async getProfile(userId: number) {
        const user = await this.profileRepository.findOne({
            where: { id: userId },
            relations: ['profileType', 'articles'],
        });

        if (!user) {
            throw new UnauthorizedException('Kullanıcı bulunamadı');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            photo: user.photo,
            profileType: user.profileType,
            articlesCount: user.articles?.length || 0,
        };
    }
}

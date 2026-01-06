import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'blog-secret-key-2024', // Production'da .env kullanın
        });
    }

    async validate(payload: any) {
        const user = await this.profileRepository.findOne({
            where: { id: payload.sub },
            relations: ['profileType']
        });

        if (!user) {
            throw new UnauthorizedException('Kullanıcı bulunamadı');
        }

        return user;
    }
}

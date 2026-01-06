import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from './profiles/entities/profile.entity';
import { ProfileType } from './profiles/entities/profile-type.entity';
import { ProfileTypesController } from './profile-types/profile-types.controller';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';

//projenin ana modülü yani ana kumanda merkezi burasıdır
@Module({
  imports: [
    // Database ayarları
    // app.module.ts içinde imports kısmında:
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'nestjs_app_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // Resimlerin tarayıcıda erişilebilmesi için statik bir yol
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),  //dosyalar bilgisayarda nerede
      serveRoot: '/uploads',  //tarayıcıda hangi yoldan erişilecek
    }),
    TypeOrmModule.forFeature([ProfileType]),
    AuthModule,
    ProfilesModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
  ],
  controllers: [ProfileTypesController],
})
export class AppModule { }
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number; // Eski format için (tek kategori)

  @IsOptional()
  @IsArray()
  categoryIds?: number[]; // Yeni format için (çoklu kategori)

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  image?: string; // Makale görseli
}
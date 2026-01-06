import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string; // Yorum metni

  @IsNumber()
  articleId: number; // Hangi makaleye? (Örn: 1)

  @IsNumber()
  authorId: number; // Kim yazdı? (Örn: 1 - Dilek)
}
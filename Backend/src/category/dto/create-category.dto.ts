import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCategoryDto {
  @IsString()    // <-- Bu YOKSA veri silinir!
  @IsNotEmpty()
  name: string;
}
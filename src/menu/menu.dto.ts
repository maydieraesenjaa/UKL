import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Spesial', description: 'Menu name' })
  name!: string;

  @ApiProperty({ example: 15000, description: 'Menu price' })
  price!: number;

  @ApiProperty({ example: 'Nasi goreng pedas dengan toping telur mata sapi dan ayam suwir', description: 'Menu description' })
  description!: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'File image menu' })
  image!: any;
}

export class UpdateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Seafood', description: 'New name of menu', required: false })
  name?: string;

  @ApiProperty({ example: 18000, description: 'New price', required: false })
  price?: number;


  @ApiProperty({ example: 'Nasi goreng dengan bumbu seafood dan udang segar', description: 'New description', required: false })
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'New file image', required: false })
  image?: any;
}
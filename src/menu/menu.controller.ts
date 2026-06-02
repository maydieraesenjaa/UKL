import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Menu')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add menu (ADMIN only)'})
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          
          callback(null, filename); 
        },
      }),
    }),
  )
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Menu photos must be uploaded!');
    }
    
    return this.menuService.create(body, file.filename);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiOperation({ summary: 'Displays all menu data'})
  findAll() {
    return this.menuService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Displays menu data with id'})
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update menu data with id'})
  update(@Param('id') id: string, @Body() body: any) {
    return this.menuService.update(Number(id), body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu data with id'})
  remove(@Param('id') id: string) {
    return this.menuService.remove(Number(id));
  }
}
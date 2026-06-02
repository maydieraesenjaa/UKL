import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({ example: 'admin_senja', description: 'Username for register' })
    username!: string;

    @ApiProperty({ example: 'senjapassword123', description: 'Password new account' })
    password!: string;

    @ApiProperty({ example: 'ADMIN', enum: Role, description: 'Role account' })
    role!: Role;
}

export class LoginDto {
    @ApiProperty({ example: 'admin_senja', description: 'Username for login' })
    username!: string;

    @ApiProperty({ example: 'senjapassword123', description: 'Password account' })
    password!: string;
}
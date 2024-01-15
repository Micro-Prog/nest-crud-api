import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
  } from '@nestjs/common';
  import { User } from '@prisma/client';
  import { GetUser } from '../auth/decorator';
  import { JwtGuard } from '../auth/guard';
  import { EditUserDto } from '../user/dto/edit-dto'
  import { UserService } from './user.service';
  

  @UseGuards(JwtGuard)
  @Controller('users')
  export class UserController {
    constructor(private userService: UserService) {}
    @Get('me')
    getMe(@GetUser() user: User) {
      return user;
    }
  
    @Patch()
    editUser(
      @GetUser('id') userObj: {id: number},
      @Body() dto: EditUserDto,
    ) {
      return this.userService.editUser(userObj, dto);
    }
  }
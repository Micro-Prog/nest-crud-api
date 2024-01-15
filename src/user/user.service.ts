import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from '../user/dto/edit-dto'


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userObj: {id: number},
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userObj.id,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }
}
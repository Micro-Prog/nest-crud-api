import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service'


@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) {}

    getBookmarks(
        userObj: {id: number},
    ) {
        return this.prisma.bookmark.findMany({
            where: {
                id: userObj.id
            }
        })
    }

    getBookmarkById(
        userObj: {id: number},
        bookmarkId: number,
    ) {
        return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId: userObj.id
            }
        })
    }

    async createBookmark(
        userId: number,
        dto: CreateBookmarkDto,
    ) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            }
        });

        return bookmark;
    }

    async editBookmarkById(
        userId: number,
        bookmarkId: number,
        dto: EditBookmarkDto,
    ) {
        const bookmark =
            await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId,
                },
            });

            // check if the use owns the bookmark
            if(!bookmark || bookmark.userId !== userId) {
                throw new ForbiddenException(
                    'Access to resources denied',
                );
            }

            return this.prisma.bookmark.update({
                where: {
                    id: bookmarkId,
                },
                data: {
                    ...dto,
                },
            });
    }

    async deleteBookmarkById(
        userId: number,
        bookmarkId: number,
    ) {
        const bookmark =
        await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        // check if the use owns the bookmark
        if(!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException(
                'Access to resources denied',
            );
        }

        await this.prisma.bookmark.delete({
            where: {
              id: bookmarkId,
            },
          });
    }
}

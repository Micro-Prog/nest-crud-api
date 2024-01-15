import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/index';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator/index';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';


@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {}
    
    @Get()
    getBookmarks(@GetUser('id') userObj: {id: number}) {
        return this.bookmarkService.getBookmarks(
            userObj,
        );
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userObj: {id: number},
        @Param('id', ParseIntPipe) bookmarkId: number,
        ) {
            return this.bookmarkService.getBookmarkById(
                userObj,
                bookmarkId,
            );
        }

    @Post()
    createBookmark(
        @GetUser('id') userObj: {id: number},
        @Body() dto: CreateBookmarkDto,
        ) {
            return this.bookmarkService.createBookmark(
                    userObj.id,
                    dto,
            );
        }

    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userObj: {id: number},
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: EditBookmarkDto,
        ) {
            return this.bookmarkService.editBookmarkById(
                userObj.id,
                bookmarkId,
                dto,
            );
        }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userObj: {id: number},
        @Param('id', ParseIntPipe) bookmarkId: number, 
    ) {
        return this.bookmarkService.deleteBookmarkById(
            userObj.id,
            bookmarkId,
        );
    }

}

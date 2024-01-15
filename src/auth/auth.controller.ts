import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from '../auth/dto/auth.dto'



@Controller('auth')
export class AuthContoller {
    constructor(private authService: AuthService) {}

    @HttpCode(201)
    @Post('signup')
    signup(
        @Body() dto: AuthDto
        // @Body('email') email: string,
        // @Body('password', ParseIntPipe) password: string,
    ) {
        // console.log({
        //     email,
        //     typeofem: typeof email,
        //     password,
        //     typeofpass: typeof password,
        // })
        return this.authService.signup(dto)
    }
    
    @Post('signin')
    @HttpCode(200)
    signin(
        @Body() dto: AuthDto

    ) {
        return this.authService.login(dto)
    }

}
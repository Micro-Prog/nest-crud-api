import { Body, Controller, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/auth/dto";



@Controller('auth')
export class AuthContoller {
    constructor(private authService: AuthService) {}

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
        return this.authService.signup()
    }

    @Post('signin')
    signin() {
        return this.authService.login()
    }

}
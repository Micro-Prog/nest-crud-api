import { Module } from "@nestjs/common";
import { AuthContoller } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from '../prisma/prisma.module'
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";


@Module({
    imports: [PrismaModule, JwtModule.register({

    })],
    controllers: [AuthContoller],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
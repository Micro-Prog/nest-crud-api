import { Module } from "@nestjs/common";
import { AuthContoller } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [AuthContoller],
    providers: [AuthService],
})
export class AuthModule {}
import { JwtService } from "@nestjs/jwt";

export default class AuthUtils {

    private static jwtService: JwtService;

    static setJwtService(jwtService: JwtService) {
        this.jwtService = jwtService;
    }

    static async createAccessToken(userId: string) {
        return this.jwtService.sign({ userId });
    }
}
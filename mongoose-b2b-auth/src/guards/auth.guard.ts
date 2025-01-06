import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService : JwtService){}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request : any = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if(!authHeader){
        throw new UnauthorizedException("User is unauthorized");
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = this.jwtService.verify(token);
        request.userId = payload.userId;
    } catch (error) {
        Logger.error(error);
        throw new UnauthorizedException("User is unauthorized");
    }
    return true;
  }
}
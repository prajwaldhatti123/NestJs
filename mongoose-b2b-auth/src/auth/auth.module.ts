import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenSchema } from './schemas/Refresh-token';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name: "User" , schema: UserSchema},
      {name: "RefreshToken" , schema: RefreshTokenSchema}
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

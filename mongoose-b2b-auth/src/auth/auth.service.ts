import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4} from 'uuid';
import { RefreshToken } from './schemas/Refresh-token';
import { ChangePasswordDto } from './dto/change-password.dto';
@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel : Model<User> ,
    private jwtService : JwtService,
    @InjectModel(RefreshToken.name) private refreshTokenModel : Model<RefreshToken>
  ){}
  
  async create(createAuthDto: CreateAuthDto) : Promise<string> {
    const {email , password} = createAuthDto;
    const checkEmail = await this.userModel.findOne({email: createAuthDto.email});
    if(checkEmail){
      throw new BadRequestException("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password , 10);
    const user = new this.userModel({...createAuthDto , password: hashedPassword});
    user.save();
    return "User created successfully";
  }

  async login(loginAuthDto: LoginAuthDto ) : Promise<Object> {
    const { email , password } = loginAuthDto;
    const user = await this.userModel.findOne({email});
    if(!user){
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordMatched = await bcrypt.compare(password , user.password);
    if(!isPasswordMatched){
      throw new UnauthorizedException("Invalid credentials");
    }
    const result = this.generateAccessToken(user._id.toString())
    return result;
  }

  async generateAccessToken(userId: string) {
    const accessToken =  this.jwtService.sign({userId});
    const refreshToken = uuidv4();
    await this.storeRefreshToken(userId , refreshToken);
    return {
      accessToken,
      refreshToken  
    }
  }

  async storeRefreshToken(userId: string , refreshToken: string) {
    const user = await this.userModel.findById(userId);
    if(!user){
      throw new UnauthorizedException("Invalid credentials");
    }
    const token = new this.refreshTokenModel({userId , token: refreshToken , expiryDate: new Date(Date.now() + 7*24*60*60*1000)});
    token.save();
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenModel.findOneAndDelete({token: refreshToken , expiryDate: {$gt: new Date()}});
    if(!token){
      throw new UnauthorizedException("Invalid refresh token");
    }
    const user = await this.userModel.findById(token.userId);
    if(!user){
      throw new UnauthorizedException("Invalid refresh token");
    }
    await this.refreshTokenModel.deleteMany({userId: token.userId});
    const result = this.generateAccessToken(user._id.toString());
    return result;
  }

  async changePassword(userId: string , changePasswordDto: ChangePasswordDto) {
    const {oldPassword , newPassword} = changePasswordDto;
    if(oldPassword === newPassword){
      throw new BadRequestException("Old password and new password cannot be same");
    }
    const user = await this.userModel.findById(userId);
    if(!user){
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordMatched = await bcrypt.compare(oldPassword , user.password);
    if(!isPasswordMatched){
      throw new UnauthorizedException("Invalid credentials");
    }
    const hashedPassword = await bcrypt.hash(newPassword , 10);
    user.password = hashedPassword;
    user.save();
    return "Password changed successfully"
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({email});
    if(!user){
      throw new BadRequestException("User not found");
    }
    const token = uuidv4();
    // Send email with token
    return {message: "Email sent successfully if the user exists"};
  }



  findAll(userId: string) {
    return `This action returns all auth made by  ${userId}`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Res, UseFilters, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { validationExceptionFilter } from './exception-filters/badRequset';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @UsePipes(new ValidationPipe())
  async create(@Body() createAuthDto: CreateAuthDto , @Res() res : Response) {
    const result =  await this.authService.create(createAuthDto);
    return res.status(201).json({message: result});
  }

  @Post("login")
  @UsePipes(new ValidationPipe())
  async login(@Body() loginAuthDto : LoginAuthDto , @Res() res : Response) {
    const result =  await this.authService.login(loginAuthDto);
    return res.status(200).json(result);
  }

  @Post("refreshtoken")
  @UsePipes(new ValidationPipe())
  @UseFilters( new validationExceptionFilter())
  async refreshToken (@Body() body : RefreshTokenDto , @Res() res : Response){
    const result = await this.authService.refreshTokens(body.refreshToken);
    return res.status(200).json(result);
  }

  @UseGuards(AuthGuard)
  @Get("all")
  findAll(@Req() req : any )  {
    return this.authService.findAll(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post("change-password")
  @UsePipes(new ValidationPipe())
  async changePassword(@Req() req : any , @Body() changePasswordDto : ChangePasswordDto , @Res() res : Response) {
    const result = await this.authService.changePassword(req.userId , changePasswordDto);
    return res.status(200).json(result);
  }

  @UseGuards(AuthGuard)
  @Post("change-password")
  @UsePipes(new ValidationPipe())
  async forgotPassword(@Body() forgotPasswordDto : ForgotPasswordDto , @Res() res : Response) {
    const result = await this.authService.forgotPassword(forgotPasswordDto.email);
    return res.status(200).json(result);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

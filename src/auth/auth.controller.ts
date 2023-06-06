import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUser(
    @Body() req: AuthLoginDto,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.login(req, res); 
  }
}

import { Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserObj } from 'src/decorators/user-obj.decorator';


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

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logoutUser(
    @Res() res: Response,
    @UserObj() user: UserEntity,
    ): Promise<any> {
      return this.authService.logout(user, res);
  }
}

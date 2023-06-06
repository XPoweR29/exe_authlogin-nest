import {Param, Get,  Body, Controller, Inject, Post, Delete, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import {AuthGuard} from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';

@Controller('/user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
    ) {};

    @Get('/welcome') 
    @UseGuards(AuthGuard('jwt'))
    shoWelcome(
        @Res() res: Response,
        @UserObj() user: UserEntity,
        ) {
        console.log(user);
        return this.userService.showWelcome(res, user);
    }

    @Post('/register')
    registerNewUser(@Body() newUser: RegisterUserDto): Promise<Partial<UserEntity>> {
        return this.userService.registerNewUser(newUser);
    }

    @Post('/update/:id')
    updateUserData(
        @Body() newUserData: Partial<UserEntity>,
        @Param('id') userId: string,
        ): Promise<string> {
        return this.userService.updateUser(userId, newUserData);
    }

    @Delete('/:id')
    deleteUser(
        @Param('id') userId: string,
        @Res() res: Response,
        ) {
        this.userService.deleteUser(userId);
        res.status(200).json({message: 'User has been deleted successfully.'});
    }
}

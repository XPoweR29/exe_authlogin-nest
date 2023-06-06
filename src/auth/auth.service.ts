import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Token } from 'src/types/token-interface';
import { JwtPayload } from './jwt.strategy';
import { sign } from 'jsonwebtoken';
import * as dontenv from 'dotenv';
import {v4 as uuid} from 'uuid';
import { Response } from 'express';
import {compare} from 'bcrypt';

dontenv.config();


@Injectable()
export class AuthService {

    private createToken(currentTokenId: string): Token {
        const payload: JwtPayload = {id: currentTokenId};
        const expiresIn = 60; // 60secs
        const accessToken = sign(payload, process.env.SIGNATURE, {expiresIn});

        return {
            accessToken, 
            expiresIn
        };
    }

    private async generateToken(user: UserEntity): Promise<string> {
        let token: string;
        let userWithThisToken: UserEntity | null = null;

        do {
            token = uuid();
            userWithThisToken = await UserEntity.findOne({where: {currentTokenId: token}});

        } while(!!userWithThisToken) {
            user.currentTokenId = token;
            await user.save();

            return token;
        } 
    }

    async login(req: AuthLoginDto, res: Response): Promise<any> {
        try {
            const user = await UserEntity.findOne({where: {
                email: req.email,
            }});

            if(!user || !(await compare(req.pwd, user.pwd))) { // sprawdzenie użytkownika i hasła
                throw new UnauthorizedException('Invalid login data');
            } 

            const token = this.createToken(await this.generateToken(user));

            return res
                .cookie('jwt', token.accessToken, {
                    secure: false, //dla HTTPS ustawiamy true
                    domain: 'localhost', 
                    httpOnly: true, 
                })
                .json({
                    isSuccess: true,
                    message: 'You are successfully logged in'
                });

        } catch(err: any){

            return res.status(401).json({
                isSuccess: false, 
                error: err.message,
            });
        }
    }

    async logout(user: UserEntity, res: Response) {
        try {
            user.currentTokenId = null;
            await user.save();

            res.clearCookie('jwt', {
                secure: false,
                domain: 'localhost',
                httpOnly: true, 
            });

            return res.json({
                isSuccess: true,
                message: `You are successfully logged out`,
            });
        } catch(err) {
            return res.status(400).json({
                isSuccess: false,
                error: err.message,
            });   
        }
    }

}
 
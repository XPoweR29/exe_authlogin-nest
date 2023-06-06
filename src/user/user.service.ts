import { Injectable, NotFoundException, HttpException, HttpStatus} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserEntity } from './entities/user.entity';
import { promisify } from 'util';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Response } from 'express';

const hashing = promisify(hash);


@Injectable()
export class UserService {
    constructor(
        private dataSource: DataSource,
    ){}
    
    private filter(user: UserEntity): Partial<UserEntity> {
        const {id, username, email} = user;
        return {id, username, email};
    }

    private async checkIfUserExists(userData: RegisterUserDto): Promise<boolean> {
        const existingUser: UserEntity | null = await UserEntity.findOne({where: [
            {username: userData.username},
            {email: userData.email},
        ]});

        return !!existingUser;
    }


    async registerNewUser(data: RegisterUserDto) {

        const existingUser = await this.checkIfUserExists(data);
        if(existingUser){
            throw new HttpException('User with given username or email already exists', HttpStatus.CONFLICT);
        }
    
        const newUser = new UserEntity();
        newUser.username = data.username;
        newUser.email = data.email;
        newUser.pwd = await hashing(data.pwd, 10);
    
        return this.filter(await newUser.save())
    }

    async getUserByEmail(email: string): Promise<UserEntity> {
        return await UserEntity.findOne({
            where: {
                email: email,
            }
        });
    }

    async getUserById(id: string): Promise<UserEntity> {
        return await UserEntity.findOne({
            where: {
                id: id,
            }
        });
    }

    async updateUser(id: string, newUserData: Partial<UserEntity>): Promise<string> {
        const user = await this.getUserById(id);
        if(!user) {
            throw new NotFoundException('User with the given ID does not exist.');
        }

        if(newUserData.pwd) {
            const hashedPwd = await hashing(newUserData.pwd, 10);
            newUserData.pwd = hashedPwd;
        }

        await this.dataSource
            .createQueryBuilder()
            .update(UserEntity)
            .set({...newUserData})
            .where('id =:id', {id})
            .execute();

            return 'User has been updated successfully';
    }

    async deleteUser(id: string) {
        await UserEntity.delete(id);
    }

    showWelcome(res: Response, user: UserEntity) {
        res.send(
          `
            <h1>Witaj ${user.username}</h1>
            <p>Ta treść jest widoczna tylko dla zalogowanych uzytkowników. <strong>GRATUALCJE!</strong></p>
            </hr>
            <p>Twoje ID to: <strong>${user.id}</strong></p>
            `,
        );
    }
}

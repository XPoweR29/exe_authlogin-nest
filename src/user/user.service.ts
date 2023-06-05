import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserEntity } from './entities/user.entity';
import { promisify } from 'util';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';

const hashing = promisify(hash);


@Injectable()
export class UserService {
    constructor(
        private dataSource: DataSource,
    ){}

    async registerNewUser(data: RegisterUserDto) {
        const newUser = new UserEntity();
        newUser.username = data.username;
        newUser.email = data.email;
        newUser.pwd = await hashing(data.pwd, 10);

        return await newUser.save();
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
}

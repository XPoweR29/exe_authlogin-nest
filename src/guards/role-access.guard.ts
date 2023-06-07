import { Injectable } from "@nestjs/common/decorators";
import {CanActivate, ExecutionContext} from '@nestjs/common/interfaces';
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class RoleAccess implements CanActivate  {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: UserEntity = request.user;
        const requiredRole = this.reflector.get<string>('role', context.getHandler());

        return user.userRole === requiredRole ? true : false;
    }
}
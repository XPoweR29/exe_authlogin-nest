import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  id: string;
}

// funkja która wyciąga nam cookie z requestu
function cookieExtractor(req: any): string | null {
  return req && req.cookies ? req.cookies?.jwt ?? null : null; //jwt to nazwa naszego ciastka
}

const SIGNATURE = process.env.SIGNATURE;


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor, // nasze cookie z requestu
      secretOrKey: SIGNATURE, // długi ciąg znaków którymi podpisujemy nasz token.
    });
  }

  //walidacja zgodności użytkownika i JWT
  async validate(payload: JwtPayload, done: (err, user) => void) {
    //sprawdzamy czy mamy ID z cookies
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }

    const user = await UserEntity.findOne({
      where: { currentTokenId: payload.id },
    });
    //jeśli mamy to sprawdzamy czy mamy takiego użytkownika z tym ID
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    //jeśli tak to błąd jest nullem i zwracamy dane użytkownika
    done(null, user);
  }
}

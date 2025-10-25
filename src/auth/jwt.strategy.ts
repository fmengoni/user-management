// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dev-secret', // ⚠️ usa el mismo secreto que al firmar el token
    });
    console.log('✅ JwtStrategy registrada');
  }

  async validate(payload: any) {
    // Lo que retornes acá se convierte en request.user
    return {
      username: payload.username,
      // email: payload.email,
      // roles: payload.roles.map((r: any) => r._id),
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'sample_secret_key',
            ignoreExpiration: true,
        });
    }
    
    async validate(payload: any) {
        const user = await this.authService.validateUserByJwt(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { user: user };
    }

}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from './user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }      
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        secretOrPrivateKey: 'sample_secret_key',
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Mode } from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  async createUser(email: string, password: string) {

    let userToAttempt = await this.findOneByEmail(email);
    if (!userToAttempt) {
        const newUser = new this.userModel({
            email,
            password
        });
        return await newUser.save().then((user) => {
            return user.toObject({ versionKey: false });
        });
    } else {
        return new BadRequestException(`User with email: ${email} already exists.`);
    }
}

// async getMe() {

// }
async validateUserByPassword(email: string, password: string) {
    let user: any = await this.findOneByEmail(email);
    if (!user) throw new BadRequestException('Email not found !');
      return new Promise((resolve, reject) => {
        user.checkPassword(password, (error, validatedUser) => {
          if (error) {
              reject(new UnauthorizedException());
          }
          if (validatedUser) {
    
              resolve(
                this.jwtService.sign(
                  { jwtToken: {
                      id: user._id,
                      email,
                    }
                  }
                ) 
              );
          } else {
              reject(new BadRequestException(`Password don't match`));
          }
      });
  });
  
}
async validateUserByJwt(payload: any) {
  let user = await this.findOneByEmail(payload.email);
  if (user) {
      return user;
  } else {
      throw new UnauthorizedException();
  }
}

async findOneByEmail(email: string): Promise<User> {
  return await this.userModel.findOne({ email: email });
}

}

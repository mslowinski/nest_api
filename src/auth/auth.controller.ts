import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guards';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiOperation({ summary: 'signUp' })
  @Post('/signUp')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string) {
      return await this.authService.createUser(email, password);
  }

  @ApiOperation({ summary: 'signIn' })
  @Post('/signIn')
  async signIn(@Body('email') email: string, @Body('password') password: string) {
    return await this.authService.validateUserByPassword(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'me' })
  @Get('/me')
  async getMe(@Request() req) {
    return req.user;
  }
}

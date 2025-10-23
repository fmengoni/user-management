import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/infra/guard/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import ViewModel from 'src/infra/views/base.viewmodel';
import UserViewModel from 'src/users/viewModel/users.viewmodel';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return {
      access_token: this.jwtService.sign(
        ViewModel.createOne(UserViewModel, user),
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Req() req) {
    // Si el guard pasó, el token es válido
    return {
      valid: true,
      user: ViewModel.createOne(
        UserViewModel,
        await this.userService.findByUsername(req.user.username),
      ),
    };
  }
}

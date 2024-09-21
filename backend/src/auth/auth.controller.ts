import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private httpService: HttpService) {}

  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    try {
      const response = await lastValueFrom(this.httpService.post(
        `${process.env.KEYCLOAK_AUTH_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          grant_type: 'password',
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          scope: 'openid',
          username: loginData.username,
          password: loginData.password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      ));

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data || 'Login failed';
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }
}
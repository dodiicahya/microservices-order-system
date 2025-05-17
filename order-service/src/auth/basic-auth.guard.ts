import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = process.env.BASIC_AUTH_USERNAME; // 🔐 Move to .env for production
  private readonly validPassword = process.env.BASIC_AUTH_PASSWORD;

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing Basic Authorization header');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (username === this.validUsername && password === this.validPassword) {
      return true;
    }

    throw new UnauthorizedException('Invalid username or password');
  }
}

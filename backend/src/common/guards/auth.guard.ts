import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { supabase } from '../../lib/supabase';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req?.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid Tokenss');
    }

    req.user = data.user;

    return true;
  }
}

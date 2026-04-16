import { HttpException, Injectable } from '@nestjs/common';
import { db } from '../db/db';
import { users } from '../db/schema';
import { LoginDto } from './dto';
import { supabase } from 'src/lib/supabase';
import { eq } from 'drizzle-orm';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  async login(body: LoginDto) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.session || !data.user) {
      throw new HttpException(
        {
          message: 'Invalid email or password',
          code: 'AUTH_INVALID',
        },
        401,
      );
    }

    const user = data.user;

    // 🔹 check user in YOUR DB (authorization)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (!existingUser.length) {
      throw new HttpException(
        {
          message: 'User not registered',
          code: 'USER_NOT_FOUND',
        },
        403,
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async register(body: SignupDto) {
    // 🔹 check if already exists in YOUR DB
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUser.length) {
      throw new HttpException(
        {
          message: 'User already exists',
          code: 'USER_ALREADY_EXISTS',
        },
        400,
      );
    }

    // 🔹 create in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });

    if (error || !data.user) {
      throw new HttpException(
        {
          message: error?.message || 'Signup failed',
          code: 'AUTH_SIGNUP_FAILED',
        },
        400,
      );
    }

    const user = data.user;

    // 🔹 insert into your DB
    await db.insert(users).values({
      id: user.id,
      email: user.email!,
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: data.session?.access_token ?? null,
      refreshToken: data.session?.refresh_token ?? null,
    };
  }

  async me(token: string) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new HttpException(
        {
          message: 'Invalid session',
          code: 'INVALID_SESSION',
        },
        401,
      );
    }

    const authUser = data.user;

    // 🔹 Fetch full user from your DB
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id));

    if (!existingUser.length) {
      throw new HttpException(
        {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        404,
      );
    }

    const user = existingUser[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };
  }

  async refresh(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new HttpException(
        {
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        },
        401,
      );
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }
}

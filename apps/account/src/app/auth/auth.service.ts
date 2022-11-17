import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountLogin, AccountRegister } from '@purple/contracts';
import { UserRole } from '@purple/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}
  async register({
    email,
    password,
    displayName,
  }: AccountRegister.Request): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUser(email);
    if (oldUser) {
      throw new Error('User already exists');
    }
    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);
    const newUser = await this.userRepository.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Invalid login or password');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassowrd = userEntity.validatePassword(password);
    if (!isCorrectPassowrd) {
      throw new Error('Invalid login or password');
    }
    return { id: user._id };
  }

  async login(id: string): Promise<AccountLogin.Response> {
    return {
      access_token: await this.jwtService.sign({ id }),
    };
  }
}

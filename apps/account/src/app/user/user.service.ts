import { Injectable } from '@nestjs/common';
import { AccountChangeProfile } from '@purple/contracts';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async changeProfile({
    id,
    displayName,
  }: AccountChangeProfile.Request): Promise<void> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new Error('Such user does not exist');
    }

    const userEntity = new UserEntity(user).updateProfile(displayName);

    await this.userRepository.updateUserDisplayName(userEntity);
  }
}

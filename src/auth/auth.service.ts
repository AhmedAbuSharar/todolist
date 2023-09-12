import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/models';
import { hash, compare } from 'bcrypt';
import { SALT, USER_REPOSITORY } from '../common/constants';
import { SignInDto, SignUpDto } from './dto';
import { CustomLogger } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private jwtService: JwtService,
    private customLogger: CustomLogger,
  ) {}

  async signIn(signInDto: SignInDto) {
    this.customLogger.log('signIn');
    const user = await this.userRepository.scope('withPassword').findOne({
      where: { email: signInDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await compare(signInDto.password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return await this.createToken(user);
  }
  async signUp(signUpDto: SignUpDto) {
    this.customLogger.log('signIn');
    const user = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });
    if (user) throw new UnauthorizedException();
    const passwordHash = await hash(signUpDto.password, SALT);
    const createdUser = await this.userRepository.create({
      email: signUpDto.email,
      name: signUpDto.name,
      password: passwordHash,
    });
    return await this.createToken(createdUser);
  }
  private async createToken(user: User) {
    this.customLogger.log('createToken');
    const payload = { id: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

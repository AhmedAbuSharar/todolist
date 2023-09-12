// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService]
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants';
import { User } from 'src/database/models';
import { USER_REPOSITORY } from 'src/common/constants';
import { CustomLogger } from 'src/common/logger/logger.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useValue: User,
    },
    CustomLogger,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

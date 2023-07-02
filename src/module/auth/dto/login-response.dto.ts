import { User } from 'src/module/user/entities/user.entity';

export class ResponseDto {
  accessToken: string;
  user: User;
}

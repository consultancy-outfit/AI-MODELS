import { Injectable } from '@nestjs/common';
import { mockDb } from '../../store/mock-db';

@Injectable()
export class UsersService {
  findById(id: string) {
    return mockDb.users.find((user) => user.id === id) ?? null;
  }
}

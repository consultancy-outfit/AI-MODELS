import type { AuthenticatedUser } from '../apps/common/auth/auth.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

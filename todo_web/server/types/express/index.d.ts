import type { UserDocument } from '../../models/user';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};


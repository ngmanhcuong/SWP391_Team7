import { User } from '../../../types';

export function normalizeUser(raw: User & { _id?: string }): User {
  return {
    ...raw,
    id: raw.id || raw._id || '',
  };
}

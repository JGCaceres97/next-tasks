import bcrypt from 'bcryptjs';

export const encrypt = (text: string) => bcrypt.hash(text, 12);

export const decrypted = (text: string, hash?: string) => {
  if (!hash) return Promise.resolve(false);

  return bcrypt.compare(text, hash);
};

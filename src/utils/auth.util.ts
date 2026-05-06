import bcrypt from 'bcrypt';

export const generatePassword = () => {
  const random = Math.random().toString(36).slice(-6);
  return `Pw@${random}`;
};

export const generateUsername = (name: string): string => {
  const parts = name.toLowerCase().split(' ');
  return `${parts[0]}@!${parts[1]}`;
};

export const hashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

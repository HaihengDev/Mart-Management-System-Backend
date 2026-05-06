export const generateUsername = (name: string): string => {
  const parts = name.toLowerCase().split('');
  return `${parts[0]}@!${parts[1]}`;
};

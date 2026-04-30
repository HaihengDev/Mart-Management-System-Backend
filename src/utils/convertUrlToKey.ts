export const convertUrlToKey = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.pathname.substring(1);
  } catch (err) {
    return null;
  }
};

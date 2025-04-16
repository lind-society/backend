import * as bcrypt from 'bcrypt';

export async function hash(text: string): Promise<string> {
  return await bcrypt.hash(text, 10);
}

export async function compareHash(
  plainText: string,
  hashedText: string,
): Promise<boolean> {
  return await bcrypt.compare(plainText, hashedText);
}

import { SodiumPlus } from "sodium-plus";

export const DEFAULT_TIPLINK_KEYLENGTH = 12;
export const SEED_LENGTH = 32;

export const xor = (a: Uint8Array, b: Uint8Array) =>  {
  if (a.length !== b.length) {
    throw new Error('Inputs should have the same length')
  }

  const result = new Uint8Array(a.length)

  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i]
  }

  return result
}

let sodium: SodiumPlus;

export const kdf = async (fullLength: number, pwShort: Buffer, salt: Buffer) => {
  if(!sodium) sodium = await SodiumPlus.auto();
  const pwKey = await sodium.crypto_pwhash(
    fullLength,
    pwShort,
    salt,
    sodium.CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE,
    sodium.CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE
  );
  return pwKey.getBuffer();
}

export const randBuf = async (l: number) => {
  if(!sodium) sodium = await SodiumPlus.auto();
  return sodium.randombytes_buf(l);
}

export const getSalt = async () => {
  return randBuf(sodium.CRYPTO_PWHASH_SALTBYTES);
}

export const kdfz = async (fullLength: number, pwShort: Buffer) => {
  if(!sodium) sodium = await SodiumPlus.auto();
  const salt = Buffer.alloc(sodium.CRYPTO_PWHASH_SALTBYTES);
  return await kdf(fullLength, pwShort, salt);
}

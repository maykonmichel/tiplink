import { SodiumPlus } from "sodium-plus";

const xor = (a, b) =>  {
  if (a.length !== b.length) {
    throw new Error('Inputs should have the same length')
  }

  const result = new Uint8Array(a.length)

  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i]
  }

  return result
}

let sodium;
const getSodium = async () => {
  if(!sodium) {
    // Select a backend automatically, but expect this to be sodium wrappers
    sodium = await SodiumPlus.auto();
  }
  return sodium;
}

const kdf = async (fullLength, pwShort, salt) => {
  const na = await getSodium();
  const pwKey = await na.crypto_pwhash(
    fullLength,
    pwShort,
    salt,
    sodium.CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE,
    sodium.CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE
  );
  return pwKey.getBuffer();
}

const randBuf = async (l) => {
  const na = await getSodium();
  return na.randombytes_buf(l);
}

module.exports = {
  xor, randBuf, kdf
};
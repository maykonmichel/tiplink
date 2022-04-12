import { Connection, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

export async function sleep(timeMs: number) {
  return new Promise((resolve) => {
   setTimeout(resolve, timeMs);
  })
}

export async function getClockTime(connection: Connection): Promise<bigint> {
  const clock = (await connection.getAccountInfo(SYSVAR_CLOCK_PUBKEY))!;
  return clock.data.readBigInt64LE(8 * 4);
}

export async function waitForUnixTime(connection: Connection, unixTime: bigint, sleepIntervalMs: number = 500) {
  while (await getClockTime(connection) < unixTime) {
    await sleep(sleepIntervalMs);
  }
}
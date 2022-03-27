"""
tracking for amount held on tiplink-associated public keys
"""
import os
import logging
import typing as T

import psycopg2
from solana.rpc.api import Client, PublicKey

LAMPORTS_PER_SOL = 1000000000

def _get_addresses(dsn: str) -> T.List[PublicKey]:
    with psycopg2.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute("select public_key from address;")
            return [PublicKey(row[0]) for row in cur.fetchall()]

def _get_balance(client: Client, address: PublicKey) -> float:
    """
    returns balance in SOL
    """
    return client.get_balance(address)['result']['value'] / LAMPORTS_PER_SOL

def _update_balance(cur: psycopg2.extensions.cursor, address: PublicKey, amount: float):
    """
    update db entry for balance
    """
    logging.info(f"Setting public_key={address} balance={amount}")
    qry = f"""
    insert into balance (public_key, asset_id, amount) 
    values ('{address}', 1, {amount})
    on conflict (public_key, asset_id) 
    do update set amount = {amount} ;
    """
    cur.execute(qry)
    

def main():
    # not rate-limited, same as we use for web
    url = os.environ["MAINNET_RPC_URL"]
    dsn = os.environ['DSN']
    logging.info("mainnet_rpc_url={url}")
    client  = Client(url)
    addresses = _get_addresses(dsn)
    balances = [_get_balance(client, address) for address in addresses]
    with psycopg2.connect(dsn) as conn:
        with conn.cursor() as cur:
            for address, balance in zip(addresses, balances):
                _update_balance(cur, address, balance)

if __name__ == "__main__":
    main()

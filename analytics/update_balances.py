"""
tracking for amount held on tiplink-associated public keys
"""
import os
import logging
import typing as T
import time

import psycopg2
from solana.rpc.api import Client, PublicKey

LAMPORTS_PER_SOL = 1000000000

class BalanceUpdater:
    """
    gets all addresses from database and updates balances
    """
    def __init__(self, rpc_url, dsn):
        self.url = rpc_url
        self.dsn = dsn
        self.client  = Client(self.url)

    def _get_addresses(self) -> T.List[PublicKey]:
        with psycopg2.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("select public_key from address;")
                return [PublicKey(row[0]) for row in cur.fetchall()]

    def _get_balance(self, address: PublicKey) -> float:
        """
        returns balance in SOL
        """
        def _gb():
            return self.client.get_balance(address)['result']['value'] / LAMPORTS_PER_SOL

        try:
            return _gb()
        except Exception as e:
            logging.error(e)
            time.sleep(5)
            return _gb()
        
    def _get_balances(self, addresses: T.List[PublicKey]) -> T.List[float]:
        balances = []
        for address in addresses:
            logging.info(f"getting balance for {address}")
            balances.append(self._get_balance(address))
        return balances

    @staticmethod
    def _update_balance(cur: psycopg2.extensions.cursor, address: PublicKey, amount: float):
        logging.info(f"Setting public_key={address} balance={amount}")
        qry = f"""
        insert into balance (public_key, asset_id, amount) 
        values ('{address}', 1, {amount})
        on conflict (public_key, asset_id) 
        do update set amount = {amount} ;
        """
        cur.execute(qry)

    def update(self):
        addresses = self._get_addresses()
        balances = self._get_balances(addresses)
        with psycopg2.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                for address, balance in zip(addresses, balances):
                    self._update_balance(cur, address, balance)
    

def main():
    # not rate-limited, same as we use for web
    logging.basicConfig(
        level=logging.INFO, 
        format= '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s'
    )
    logging.info("mainnet_rpc_url={url}")
    updater = BalanceUpdater(os.environ["MAINNET_RPC_URL"], os.environ["DSN"])

    while True:
        updater.update()

if __name__ == "__main__":
    main()

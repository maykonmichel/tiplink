import { useLink } from '../useLink';

const Balance = () => {
  const { balanceSOL, balanceUSD, exchangeRate } = useLink();

  const solBalance = isNaN(balanceSOL) ? "Loading..." : balanceSOL.toFixed(4) + " SOL";
  const usdBalance  = isNaN(balanceUSD) ? "" : "$" + balanceUSD.toFixed(2);
  // console.log(balance);
  // it seems 1 SOL maps to 1e9 of whatever units getBalance returns
  // after fees, you have 0.000045 SOL in wallet when you withdraw, so want this to round to 0
  return (
    <div>
      <p>Balance (SOL): {solBalance}</p>
      <p>Balance (USD): {usdBalance}</p>
      <p>Exchange Rate: {exchangeRate.toFixed(2)}</p>

    </div>
  );
}

export default Balance;
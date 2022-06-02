export default function getSumsForProvide(
  amountA: number,
  amountB: number,
  reserveA: number,
  reserveB: number,
  additional: number,
) {
  let argA = qtyOneForOther(amountB, reserveB, reserveA);
  let argB = qtyOneForOther(amountA, reserveA, reserveB);
  let minAmountA = Math.min(amountA, argA);
  let minAmountB = Math.min(amountB, argB);
  let crmin = Math.min(reserveA, reserveB);
  let crmax = Math.max(reserveA, reserveB);
  let crquotient = ~~(crmax / crmin);
  let crremainder = crmax % crmin;
  let amountMin =
    Math.min(minAmountA, minAmountB) + (additional ? additional : 0);
  let amountOther = amountMin * crquotient + (amountMin * crremainder) / crmin;
  let acceptForProvideA = minAmountA < minAmountB ? amountMin : amountOther;
  let acceptForProvideB = minAmountB < minAmountA ? amountMin : amountOther;

  return [Math.floor(acceptForProvideA), Math.floor(acceptForProvideB)];
}

function qtyOneForOther(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
) {
  return Math.floor((amountIn * reserveOut) / reserveIn);
}

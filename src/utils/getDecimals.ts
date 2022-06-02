export default function getDecimals(decimals: number) {
  let x = "1";
  let decimalsNum = Number(decimals);
  for (let i = 0; i < decimalsNum; i++) {
    x += "0";
  }
  return Number(x);
}

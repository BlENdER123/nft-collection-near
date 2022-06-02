import random from "lodash/random";

import { AddLiquidityArg } from "../types";

export default async function addLiquidity(
  arg: AddLiquidityArg,
): Promise<boolean> {
  return new Promise((res) =>
    setTimeout(() => res(true), random(0, 3, true) * 1e3),
  );
}

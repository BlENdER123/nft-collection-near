import random from "lodash/random";

import { RemoveLiquidityArg } from "../types";

export default async function removeLiquidity(
  arg: RemoveLiquidityArg,
): Promise<boolean> {
  return new Promise((res) =>
    setTimeout(() => res(true), random(0, 3, true) * 1e3),
  );
}

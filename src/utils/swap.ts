import random from "lodash/random";

import { MakeSwapArg } from "../types";

export default async function swap(arg: MakeSwapArg): Promise<boolean> {
  return new Promise((res) =>
    setTimeout(() => res(true), random(0, 3, true) * 1e3),
  );
}

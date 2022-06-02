import random from "lodash/random";

import { CreatePairArg } from "../types";

export default async function cratePairFunc(arg: CreatePairArg): Promise<boolean> {
  return new Promise((res) =>
    setTimeout(() => res(true), random(0, 5, true) * 1e3),
  );
}

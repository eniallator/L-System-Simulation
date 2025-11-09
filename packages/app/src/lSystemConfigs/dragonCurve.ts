import { forwardAction, turnAction } from "../lSystem/reducer/action.ts";
import { defaultDrawActions } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const dragonCurve: LSystemConfig<AppCtx> = {
  axiom: "F",
  rules: {
    F: "F+G",
    G: "F-G",
  },
  instructions: _dimensions => ({
    F: t => [forwardAction(t * 10)],
    G: t => [forwardAction(t * 10)],
    "+": t => [turnAction((t * Math.PI) / 2)],
    "-": t => [turnAction(-(t * Math.PI) / 2)],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 10,
  startPos: dimensions => dimensions.copy().divide(2),
  startDir: -Math.PI / 2,
};

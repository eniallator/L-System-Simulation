import {
  flipTurnsAction,
  forwardAction,
  popAction,
  pushAction,
  turnAction,
} from "../lSystem/reducer/action.ts";
import { defaultDrawActions } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const snowflake: LSystemConfig<AppCtx> = {
  axiom: "[B]-[B]-[B]-[B]-[B]-[B]",
  rules: {
    // B: "[-FB]--G|B",
    // B: "[-F+B]--G|B",
    B: "[-FB]G|B",
    G: "G[B]G",
    F: "F[B]F",
  },
  instructions: _dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": _t => [turnAction(Math.PI / 3)],
    "-": _t => [turnAction(-Math.PI / 3)],
    F: t => [forwardAction(t * 4)],
    G: t => [forwardAction(t * 8)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => dimensions.copy().divide(2),
  startDir: 0,
};

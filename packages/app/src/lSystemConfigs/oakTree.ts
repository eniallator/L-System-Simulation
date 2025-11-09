import { Vector } from "@web-art/linear-algebra";

import {
  flipTurnsAction,
  forwardAction,
  popAction,
  pushAction,
  turnAction,
} from "../lSystem/reducer/action.ts";
import { organicDrawActions } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const oakTree: LSystemConfig<AppCtx> = {
  axiom: "B",
  rules: {
    B: "F[-FB]F[+FB]|B",
    F: "GG",
    G: "GG",
  },
  instructions: dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": t => [turnAction((t * Math.PI) / 6)],
    "-": t => [turnAction((t * -Math.PI) / 6)],
    F: t => [forwardAction((t * dimensions.getMin()) / 200)],
    G: t => [forwardAction((t * dimensions.getMin()) / 200)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 6,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

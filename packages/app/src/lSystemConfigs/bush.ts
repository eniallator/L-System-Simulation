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

export const bush: LSystemConfig<AppCtx> = {
  axiom: "-X",
  rules: {
    X: "F+[|X]F-[-FX]+X",
    Y: "G+[|Y]G-[-GY]+Y",
  },
  instructions: dimensions => ({
    F: t => [forwardAction((t * dimensions.y()) / 60)],
    G: t => [forwardAction((t * dimensions.y()) / 60)],
    "+": t => [turnAction(t * Math.PI * (30 / 180))],
    "-": t => [turnAction(t * Math.PI * -(30 / 180))],
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -(65 / 180) * Math.PI,
};

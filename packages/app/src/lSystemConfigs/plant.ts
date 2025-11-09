import { Vector } from "@web-art/linear-algebra";

import {
  forwardAction,
  popAction,
  pushAction,
  turnAction,
} from "../lSystem/reducer/action.ts";
import { defaultDrawActions } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const plant: LSystemConfig<AppCtx> = {
  axiom: "-F+[[X]-X]-F[-FX]+X",
  rules: {
    X: "F+[[X]-X]-F[-FX]+X",
  },
  instructions: _dimensions => ({
    F: t => [forwardAction(30 * t)],
    "-": t => [turnAction((25 / 360) * 2 * Math.PI * t)],
    "+": t => [turnAction(-(25 / 360) * 2 * Math.PI * t)],
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 4,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

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

export const binaryTree: LSystemConfig<AppCtx> = {
  axiom: "0",
  rules: {
    "0": "1[0]0",
    "1": "11",
  },
  instructions: _dimensions => ({
    "0": t => [forwardAction(t * 20)],
    "1": t => [forwardAction(t * 20)],
    "[": t => [pushAction(), turnAction((t * Math.PI) / 4)],
    "]": t => [popAction(), turnAction((t * -Math.PI) / 4)],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 4,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

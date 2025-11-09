import { Vector } from "@web-art/linear-algebra";

import { forwardAction, turnAction } from "../lSystem/reducer/action.ts";
import { defaultDrawActions } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const kochCurve: LSystemConfig<AppCtx> = {
  axiom: "F",
  rules: {
    F: "F+F-F-F+F",
  },
  instructions: _dimensions => ({
    F: t => [forwardAction(t * 10)],
    "+": t => [turnAction((t * Math.PI) / 2)],
    "-": t => [turnAction(-(t * Math.PI) / 2)],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 4,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

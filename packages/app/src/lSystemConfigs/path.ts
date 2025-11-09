import { Vector } from "@web-art/linear-algebra";

import {
  flipTurnsAction,
  forwardAction,
  popAction,
  pushAction,
  turnAction,
} from "../lSystem/reducer/action.ts";
import { GOLDEN_RATIO } from "./helpers.ts";

import type { LSystemConfig } from "../lSystem/types.ts";
import type { AppCtx } from "./helpers.ts";

export const path: LSystemConfig<AppCtx> = {
  axiom: "B",
  rules: {
    B: "[F+F-F+G]|[F+F-F+G]",
    F: "F[B]F",
    G: "[+B]",
  },
  instructions: dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": _t => [turnAction(Math.PI / 2)],
    "-": _t => [turnAction(-Math.PI / 2)],
    F: t => [forwardAction((t * (dimensions.y() - 10)) / 2 / 32)],
    G: t => [forwardAction((t * (dimensions.y() - 10)) / 2 / 32)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: {
    Forward({ ctx }, { totalIterations, index, action, currState, oldPos }) {
      if (action.draw) {
        ctx.lineWidth = 2 + (totalIterations / 5) ** 2 * 8;

        const randomH = (GOLDEN_RATIO * index) % 1;
        const randomS = (GOLDEN_RATIO * 2 * index) % 1;
        const randomL = (GOLDEN_RATIO * 3 * index) % 1;
        ctx.strokeStyle = `hsl(${Math.max(
          10,
          34 + (randomH - 0.5) * 40
        )},${Math.max(10, 35 + (randomS ** 2 - 0.5) * 40)}%,${60 + (randomL ** 2 - 0.5) * 30}%)`;

        ctx.beginPath();
        ctx.moveTo(oldPos.x(), oldPos.y());
        ctx.lineTo(currState.turtle.pos.x(), currState.turtle.pos.y());
        ctx.stroke();
      }
    },
  },
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

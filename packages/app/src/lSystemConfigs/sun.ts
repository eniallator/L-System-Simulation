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

export const sun: LSystemConfig<AppCtx> = {
  axiom: "[B]++[B]++[B]++[B]++[B]++[B]",
  rules: {
    B: "[-FB]-F[+FB]+F",
  },
  instructions: dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": _t => [turnAction(Math.PI / 6)],
    "-": _t => [turnAction(-Math.PI / 6)],
    F: t => [forwardAction((t * dimensions.getMin()) / 70)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: {
    Forward(
      { ctx },
      { atom, totalIterations, index, action, currState, oldPos }
    ) {
      if (action.draw) {
        const randomValue = (GOLDEN_RATIO * index) % 1;
        ctx.lineWidth =
          2 +
          ((totalIterations - atom.iteration) / totalIterations) ** 0.5 * 12;
        ctx.strokeStyle = `rgb(${200 + (1 - randomValue) * 30},${170 + randomValue * 30},50)`;

        ctx.beginPath();
        ctx.moveTo(oldPos.x(), oldPos.y());
        ctx.lineTo(currState.turtle.pos.x(), currState.turtle.pos.y());
        ctx.stroke();
      }
    },
  },
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => dimensions.copy().divide(2),
  startDir: -Math.PI / 4,
};

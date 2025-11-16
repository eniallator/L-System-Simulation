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

export const acaciaTree: LSystemConfig<AppCtx> = {
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
  drawActions: {
    Forward(
      { ctx },
      { atom, totalIterations, index, action, currState, oldPos }
    ) {
      if (action.draw) {
        const isLeaf = atom.iteration === totalIterations && atom.char === "F";
        ctx.lineWidth = isLeaf
          ? 7
          : 4 +
            (Math.max(0, 300 - currState.turtle.distanceTraveled) / 300) * 4;
        const randomValue =
          (GOLDEN_RATIO * (isLeaf ? index : Math.floor(index / 5))) % 1;
        const percent = Math.abs(atom.iteration) / totalIterations;
        ctx.strokeStyle = isLeaf
          ? `rgb(20, ${50 + randomValue * 150}, ${20 + (1 - randomValue) * 30})`
          : `rgb(${Math.max(
              50,
              155 * (percent * 0.6 + randomValue * 0.4)
            )},${Math.max(70, 170 * (percent * 0.6 + randomValue * 0.4))},0)`;

        ctx.beginPath();
        ctx.moveTo(oldPos.x(), oldPos.y());
        ctx.lineTo(currState.turtle.pos.x(), currState.turtle.pos.y());
        ctx.stroke();
      }
    },
  },
  iterationDuration: 1,
  maxIterations: 6,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

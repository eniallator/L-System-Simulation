import type { Config } from "../config.ts";
import type { AppContext } from "../lib/index.ts";
import type { DrawActions } from "../lSystem/index.ts";

export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export type AppCtx = AppContext<Config>;

export const defaultDrawActions = (
  overrides: DrawActions<AppCtx> = {}
): DrawActions<AppCtx> => ({
  Forward({ ctx }, { action, currState, oldPos }) {
    if (action.draw) {
      ctx.beginPath();
      ctx.moveTo(oldPos.x(), oldPos.y());
      ctx.lineTo(currState.turtle.pos.x(), currState.turtle.pos.y());
      ctx.stroke();
    }
  },
  ...overrides,
});

export const organicDrawActions = (
  overrides: DrawActions<AppCtx> = {}
): DrawActions<AppCtx> => ({
  Forward(
    { ctx },
    { atom, totalIterations, index, action, currState, oldPos }
  ) {
    if (action.draw) {
      const isLeaf = atom.iteration === totalIterations && atom.char === "F";
      ctx.lineWidth = isLeaf
        ? 7
        : 4 + (Math.max(0, 300 - currState.turtle.distanceTraveled) / 300) * 4;
      const randomValue = (GOLDEN_RATIO * index) % 1;
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
  ...overrides,
});

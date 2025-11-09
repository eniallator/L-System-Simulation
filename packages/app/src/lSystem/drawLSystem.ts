import { initialTurtleState, reduce } from "./reducer/index.ts";

import type { Vector } from "@web-art/linear-algebra";
import type { Atom, DrawActions, DrawFn, Instructions } from "./types.ts";

interface DrawOptions<C> {
  ctx: C;
  startPos: Vector<2>;
  startDir: number;
  drawActions: DrawActions<C>;
  atoms: readonly Atom[];
  instructions: Instructions;
  totalIterations: number;
  dt: number;
}

export const drawLSystem = <C>(options: DrawOptions<C>): void => {
  const {
    ctx,
    startPos,
    startDir,
    drawActions,
    atoms,
    instructions,
    totalIterations,
    dt,
  } = options;

  let currState = initialTurtleState(startPos, startDir);
  let index = 0;
  for (const atom of atoms) {
    const t =
      atom.iteration === totalIterations
        ? dt
        : -atom.iteration === totalIterations
          ? 1 - dt
          : 1;

    for (const action of instructions[atom.char]?.(t) ?? []) {
      const drawFn = drawActions[action.type] as
        | DrawFn<typeof action, C>
        | undefined;

      if (drawFn != null) {
        const oldPos = currState.turtle.pos.copy();
        currState = reduce(currState, action);

        drawFn(ctx, {
          totalIterations,
          index: index++,
          action,
          atom,
          currState,
          oldPos,
        });
      } else {
        currState = reduce(currState, action);
      }
    }
  }
};

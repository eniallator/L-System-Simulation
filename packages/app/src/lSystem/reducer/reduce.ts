import { checkExhausted, polarToCartesian, raise } from "@web-art/core";

import type { Action } from "./action.ts";
import type { TurtleState } from "./types.ts";
import { Vector } from "@web-art/linear-algebra";

export const reduce = (state: TurtleState, action: Action): TurtleState => {
  switch (action.type) {
    case "Forward": {
      const newPos = state.turtle.pos.add(
        Vector.create(...polarToCartesian(action.length, state.turtle.dir))
      );

      return {
        ...state,
        turtle: {
          ...state.turtle,
          distanceTraveled: state.turtle.distanceTraveled + action.length,
          pos: newPos,
        },
      };
    }

    case "Turn": {
      return {
        ...state,
        turtle: {
          ...state.turtle,
          dir:
            state.turtle.dir +
            (state.turtle.dirFlipped ? -1 : 1) * action.radians,
        },
      };
    }

    case "PushState":
      return {
        ...state,
        stateStack: [
          { ...state.turtle, pos: state.turtle.pos.copy() },
          ...state.stateStack,
        ],
      };

    case "PopState": {
      const [turtle, ...stateStack] = state.stateStack;

      return {
        turtle: turtle ?? raise(new Error("Ran out of states to pop!")),
        stateStack,
      };
    }

    case "FlipTurns":
      return {
        ...state,
        turtle: {
          ...state.turtle,
          dirFlipped: action.newValue ?? !state.turtle.dirFlipped,
        },
      };

    default:
      return checkExhausted(action);
  }
};

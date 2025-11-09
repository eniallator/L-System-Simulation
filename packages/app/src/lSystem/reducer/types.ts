import type { Vector } from "@web-art/linear-algebra";

export interface Turtle {
  pos: Vector<2>;
  dir: number;
  dirFlipped: boolean;
  distanceTraveled: number;
}

export interface TurtleState {
  turtle: Turtle;
  stateStack: Turtle[];
}

export const initialTurtleState = (
  startPos: Vector<2>,
  startDir: number
): TurtleState => ({
  turtle: {
    pos: startPos,
    dir: startDir,
    dirFlipped: false,
    distanceTraveled: 0,
  },
  stateStack: [],
});

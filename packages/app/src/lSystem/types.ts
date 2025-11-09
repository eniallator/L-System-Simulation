import type { Vector } from "@web-art/linear-algebra";
import type { Action, TurtleState } from "./reducer/index.ts";

export interface Atom {
  char: string;
  iteration: number;
}

export const stringifyAtom = (atom: Atom) => `${atom.char}(${atom.iteration})`;

export type Rules = Record<string, string>;

export type InstructionFn = (t: number) => readonly Action[];
export type Instructions = Record<string, InstructionFn>;

export interface DrawContext<A extends Action> {
  action: A;
  totalIterations: number;
  index: number;
  atom: Atom;
  currState: TurtleState;
  oldPos: Vector<2>;
}

export type DrawFn<A extends Action, C> = (
  ctx: C,
  drawCtx: DrawContext<A>
) => void;

export type DrawActions<C> = { [A in Action as A["type"]]?: DrawFn<A, C> };

export interface LSystemConfig<C> {
  axiom: string;
  rules: Rules;
  instructions: (dimensions: Vector<2>) => Instructions;
  drawActions: DrawActions<C>;
  iterationDuration: number;
  maxIterations: number;
  startPos: (dimensions: Vector<2>) => Vector<2>;
  startDir: number;
}

export interface LSystemState {
  atoms: readonly Atom[];
  iterations: number;
  lastIterationTimestamp: number;
}

export const initialLSystemState = (
  axiom: string,
  now: number
): LSystemState => ({
  atoms: axiom.split("").map(char => ({ char, iteration: 0 })),
  iterations: 0,
  lastIterationTimestamp: now,
});

export interface LSystemScene<C> {
  lSystems: { config: LSystemConfig<C>; state: LSystemState }[];
}

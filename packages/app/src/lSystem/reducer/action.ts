import { checkExhausted } from "@web-art/core";

export interface ForwardAction {
  type: "Forward";
  length: number;
  draw: boolean;
}

export interface TurnAction {
  type: "Turn";
  radians: number;
}

export interface PushAction {
  type: "PushState";
}

export interface PopAction {
  type: "PopState";
}

export interface FlipTurnsAction {
  type: "FlipTurns";
  newValue?: boolean;
}

export type Action =
  | ForwardAction
  | TurnAction
  | PushAction
  | PopAction
  | FlipTurnsAction;

export const forwardAction = (
  length: number,
  draw: boolean = true
): ForwardAction => ({ type: "Forward", length, draw });

export const turnAction = (radians: number): TurnAction => ({
  type: "Turn",
  radians,
});

export const pushAction = (): PushAction => ({ type: "PushState" });

export const popAction = (): PopAction => ({ type: "PopState" });

export const flipTurnsAction = (newValue?: boolean): FlipTurnsAction => ({
  type: "FlipTurns",
  newValue,
});

export const stringifyAction = (action: Action) => {
  switch (action.type) {
    case "Forward":
      return `Fwd(${action.length}, ${action.draw})`;

    case "Turn":
      return `Trn(${action.radians})`;

    case "PushState":
      return "Psh";

    case "PopState":
      return "Pop";

    case "FlipTurns":
      return action.newValue != null ? `Flp(${action.newValue})` : "Flp";

    default:
      return checkExhausted(action);
  }
};

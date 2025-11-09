import { appMethods } from "./lib/index.ts";
import {
  drawLSystem,
  flipTurnsAction,
  forwardAction,
  generate,
  initialLSystemState,
  popAction,
  pushAction,
  turnAction,
} from "./lSystem/index.ts";

import { Vector } from "@web-art/linear-algebra";
import type { Config } from "./config.ts";
import type { AppContext, StatefulAppContext } from "./lib/index.ts";
import type {
  DrawActions,
  LSystemConfig,
  LSystemScene,
} from "./lSystem/index.ts";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

type AppCtx = AppContext<Config>;

const defaultDrawActions = (
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

const organicDrawActions = (
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

const binaryTree: LSystemConfig<AppCtx> = {
  axiom: "0",
  rules: {
    "0": "1[0]0",
    "1": "11",
  },
  instructions: _dimensions => ({
    "0": t => [forwardAction(t * 20)],
    "1": t => [forwardAction(t * 20)],
    "[": t => [pushAction(), turnAction((t * Math.PI) / 4)],
    "]": t => [popAction(), turnAction((t * -Math.PI) / 4)],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 4,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

const plant: LSystemConfig<AppCtx> = {
  axiom: "-F+[[X]-X]-F[-FX]+X",
  rules: {
    X: "F+[[X]-X]-F[-FX]+X",
  },
  instructions: _dimensions => ({
    F: t => [forwardAction(30 * t)],
    "-": t => [turnAction((25 / 360) * 2 * Math.PI * t)],
    "+": t => [turnAction(-(25 / 360) * 2 * Math.PI * t)],
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 4,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

const koch: LSystemConfig<AppCtx> = {
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

const dragonCurve: LSystemConfig<AppCtx> = {
  axiom: "F",
  rules: {
    F: "F+G",
    G: "F-G",
  },
  instructions: _dimensions => ({
    F: t => [forwardAction(t * 10)],
    G: t => [forwardAction(t * 10)],
    "+": t => [turnAction((t * Math.PI) / 2)],
    "-": t => [turnAction(-(t * Math.PI) / 2)],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 10,
  startPos: dimensions => dimensions.copy().divide(2),
  startDir: -Math.PI / 2,
};

const snowflake: LSystemConfig<AppCtx> = {
  axiom: "[B]-[B]-[B]-[B]-[B]-[B]",
  rules: {
    // B: "[-FB]--G|B",
    // B: "[-F+B]--G|B",
    B: "[-FB]G|B",
    G: "G[B]G",
    F: "F[B]F",
  },
  instructions: _dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": _t => [turnAction(Math.PI / 3)],
    "-": _t => [turnAction(-Math.PI / 3)],
    F: t => [forwardAction(t * 4)],
    G: t => [forwardAction(t * 8)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: defaultDrawActions(),
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => dimensions.copy().divide(2),
  startDir: 0,
};

const shrub: LSystemConfig<AppCtx> = {
  axiom: "B",
  rules: {
    B: "F[-FB]F|B",
    F: "GG[++B]",
    G: "GG[++B]",
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
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

const oak: LSystemConfig<AppCtx> = {
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
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 6,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

const pine: LSystemConfig<AppCtx> = {
  axiom: "B",
  rules: {
    B: "F[-B][+B]F|B",
    F: "GG",
    G: "GG",
  },
  instructions: dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": t => [turnAction((t * Math.PI) / 5)],
    "-": t => [turnAction((t * -Math.PI) / 5)],
    F: t => [forwardAction((t * dimensions.getMin()) / 200)],
    G: t => [forwardAction((t * dimensions.getMin()) / 200)],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 6,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -Math.PI / 2,
};

const bush: LSystemConfig<AppCtx> = {
  axiom: "-X",
  rules: {
    X: "F+[|X]F-[-FX]+X",
    Y: "G+[|Y]G-[-GY]+Y",
  },
  instructions: dimensions => ({
    F: t => [forwardAction((t * dimensions.y()) / 60)],
    G: t => [forwardAction((t * dimensions.y()) / 60)],
    "+": t => [turnAction(t * Math.PI * (30 / 180))],
    "-": t => [turnAction(t * Math.PI * -(30 / 180))],
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "|": () => [flipTurnsAction()],
  }),
  drawActions: organicDrawActions(),
  iterationDuration: 1,
  maxIterations: 5,
  startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
  startDir: -(65 / 180) * Math.PI,
};

const sun: LSystemConfig<AppCtx> = {
  axiom: "[B]++[B]++[B]++[B]++[B]++[B]",
  rules: {
    B: "[-FB]-F[+FB]+F",
  },
  instructions: dimensions => ({
    "[": _t => [pushAction()],
    "]": _t => [popAction()],
    "+": _t => [turnAction(Math.PI / 6)],
    "-": _t => [turnAction(-Math.PI / 6)],
    // F: t => [forwardAction(t * 10)],
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

const path: LSystemConfig<AppCtx> = {
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

const sceneConfigs: LSystemConfig<AppCtx>[] = [
  {
    ...path,
    startPos: dimensions => Vector.create(dimensions.x() / 2, dimensions.y()),
    iterationDuration: 1.5,
  },
  {
    ...bush,
    startPos: dimensions =>
      Vector.create(dimensions.x() / 2, (dimensions.y() * 4) / 6),
  },
  {
    ...pine,
    startPos: dimensions =>
      Vector.create((dimensions.x() * 5) / 6, (dimensions.y() * 5) / 6),
    iterationDuration: 2,
  },
  {
    ...oak,
    startPos: dimensions =>
      Vector.create(dimensions.x() / 5, (dimensions.y() * 5) / 6),
    iterationDuration: 2.5,
  },
  {
    ...sun,
    startPos: dimensions =>
      Vector.create((dimensions.x() * 4) / 6, dimensions.y() / 6),
    iterationDuration: 1.5,
  },
];

const animationFrame = (
  appCtx: StatefulAppContext<Config, LSystemScene<AppCtx>>
) => {
  const { ctx, time, canvas, getState, setState } = appCtx;

  const dimensions = Vector.create(canvas.width, canvas.height);

  const state = {
    lSystems: getState().lSystems.map(({ config, state }) =>
      state.iterations < config.maxIterations &&
      time.now > state.lastIterationTimestamp + config.iterationDuration
        ? {
            config,
            state: {
              atoms: generate(state.atoms, config.rules),
              lastIterationTimestamp: time.now,
              iterations: state.iterations + 1,
            },
          }
        : { config, state }
    ),
  };
  setState(state);

  ctx.fillStyle = "rgb(17, 36, 67)";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  ctx.fillStyle = "rgb(17, 67, 27)";
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  ctx.fillStyle = "rgb(17, 45, 27)";
  ctx.beginPath();
  ctx.ellipse(
    canvas.width / 2,
    (canvas.height * 4) / 6,
    (((state.lSystems[1]?.state.iterations ?? 1) /
      (state.lSystems[1]?.config.maxIterations ?? 1)) **
      2 *
      canvas.width) /
      17,
    (((state.lSystems[1]?.state.iterations ?? 1) /
      (state.lSystems[1]?.config.maxIterations ?? 1)) **
      2 *
      canvas.height) /
      17,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.fillStyle = "rgb(17, 45, 27)";
  ctx.beginPath();
  ctx.ellipse(
    (canvas.width * 5) / 6,
    (canvas.height * 5) / 6,
    (((state.lSystems[2]?.state.iterations ?? 1) /
      (state.lSystems[2]?.config.maxIterations ?? 1)) **
      2 *
      canvas.width) /
      10,
    (((state.lSystems[2]?.state.iterations ?? 1) /
      (state.lSystems[2]?.config.maxIterations ?? 1)) **
      2 *
      canvas.height) /
      10,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.fillStyle = "rgb(17, 45, 27)";
  ctx.beginPath();
  ctx.ellipse(
    canvas.width / 5,
    (canvas.height * 5) / 6,
    (((state.lSystems[3]?.state.iterations ?? 1) /
      (state.lSystems[3]?.config.maxIterations ?? 1)) **
      2 *
      canvas.width) /
      10,
    (((state.lSystems[3]?.state.iterations ?? 1) /
      (state.lSystems[3]?.config.maxIterations ?? 1)) **
      2 *
      canvas.height) /
      10,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();

  state.lSystems.forEach(({ config, state }) => {
    drawLSystem({
      ctx: appCtx,
      startPos: config.startPos(dimensions),
      startDir: config.startDir,
      drawActions: config.drawActions,
      atoms: state.atoms,
      instructions: config.instructions(dimensions),
      totalIterations: state.iterations,
      dt: Math.min(
        (time.now - state.lastIterationTimestamp) / config.iterationDuration,
        1
      ),
    });
  });
};

export const app = appMethods<Config, LSystemScene<AppCtx>>({
  init({ canvas, ctx, time }: AppContext<Config>): LSystemScene<AppCtx> {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";

    // Art code

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return {
      lSystems: sceneConfigs.map(config => ({
        config,
        state: initialLSystemState(config.axiom, time.now),
      })),
    };
  },
  onResize(_evt, appContext) {
    this.init(appContext);
  },
  animationFrame,
});

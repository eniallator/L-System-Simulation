import { Vector } from "@web-art/linear-algebra";

import { appMethods } from "./lib/index.ts";
import { drawLSystem, generate, initialLSystemState } from "./lSystem/index.ts";
import { bush } from "./lSystemConfigs/bush.ts";
import { oakTree } from "./lSystemConfigs/oakTree.ts";
import { path } from "./lSystemConfigs/path.ts";
import { pineTree } from "./lSystemConfigs/pineTree.ts";
import { sun } from "./lSystemConfigs/sun.ts";

import type { Config } from "./config.ts";
import type { AppContext, StatefulAppContext } from "./lib/index.ts";
import type { LSystemConfig, LSystemScene } from "./lSystem/index.ts";
import type { AppCtx } from "./lSystemConfigs/helpers.ts";

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
    ...pineTree,
    startPos: dimensions =>
      Vector.create((dimensions.x() * 5) / 6, (dimensions.y() * 5) / 6),
    iterationDuration: 2,
  },
  {
    ...oakTree,
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

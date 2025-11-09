import type { Atom, Rules } from "./types.ts";

export const generate = (
  atoms: readonly Atom[],
  rules: Rules
): readonly Atom[] =>
  atoms.flatMap(atom =>
    atom.iteration >= 0
      ? rules[atom.char] != null
        ? [{ char: atom.char, iteration: -(atom.iteration + 1) }].concat(
            rules[atom.char]?.split("").map(char => ({
              char,
              iteration: atom.iteration + 1,
            })) ?? []
          )
        : [atom]
      : []
  );

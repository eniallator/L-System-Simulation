import { createParsers, textParser } from "@web-art/config-parser";

import type {
  InitParserObject,
  ParamConfigOptions,
} from "@web-art/config-parser";

export const options: ParamConfigOptions = { shortUrl: false };
export const config = createParsers({
  axiom: textParser({ label: "Axiom", default: "" }),
  rules: textParser({
    label: "Rules",
    default: "",
    area: true,
  }),
});

export type Config =
  typeof config extends InitParserObject<infer R> ? R : never;

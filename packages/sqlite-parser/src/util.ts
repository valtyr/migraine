import * as Parsinator from "./parsinator";

export type InferredResult<T> = T extends Parsinator.Parser<infer A>
  ? A
  : undefined;

export const sql = (template: TemplateStringsArray, ...items: any[]) => {
  let str = "";
  for (let i = 0; i < items.length; i++) {
    str += template[i] + String(items[i]);
  }
  return str + template[template.length - 1];
};

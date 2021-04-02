import events from "./events";

export const isValidDate = (v) => v instanceof Date && !isNaN(v.getTime());

/**
 * @param {NumberLike} valA
 * @param {NumberLike} valB
 * @param {boolean} ascending
 * @returns 1 if a is bigger, -1 if b bigger, 0 if equal
 */
export const compare = (a, b, ascending) => {
  if (ascending) return a - b;
  else return b - a;
};

export const humanizeDate = (date) =>
  new Date(date).toLocaleString([], {
    dateStyle: "full",
  });

export class Logger {
  static info = (msg, ...e) => console.info("[info]", events[msg], ...e);
  static error = (msg, ...e) => console.error("[error]", events[msg], ...e);
}

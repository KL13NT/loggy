import humanizeDuration from "humanize-duration";
import events from "./events";

export const isValidDate = (v) => {
  typeof v === "string" && isNaN(new Date(v).valueOf());
};

export const compare = (valA, valB, filter, ascending) => {
  if (ascending)
    if (filter === "lastVisit" && isValidDate(valA) && isValidDate(valB))
      return new Date(valA) - new Date(valB);
    else return valA < valB ? -1 : 1;
  else if (filter === "lastVisit" && isValidDate(valA) && isValidDate(valB))
    return new Date(valB) - new Date(valA);
  else return valB < valA ? -1 : 1;
};

const dateLocaleOptions = { dateStyle: "full" };

export const humanizeDate = (date) =>
  new Date(date).toLocaleString([], dateLocaleOptions);

export const humanizeEntry = (entry) => ({
  ...entry,
  lastVisit: new Date(entry.lastVisit).toLocaleString([], dateLocaleOptions),
  totalTime: humanizeDuration(entry.totalTime * 1000, { largest: 2 }),
});

export const logger = {
  info: (msg, ...e) => console.info("[info]", events[msg], ...e),
  error: (msg, ...e) => console.error("[error]", events[msg], ...e),
};

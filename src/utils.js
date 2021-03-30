import humanizeDuration from "humanize-duration";
import events from "./events";

export const isValidDate = (v) =>
  typeof v === "string" && !isNaN(new Date(v).valueOf());

export const isValidNumber = (v) => typeof v === "number" && !isNaN(v);

/**
 *
 * @param {import('./background/store.js').Entry} entry
 */
export const getFirstVisit = (entry) => {
  const years = Object.keys(entry)
    .filter((key) => isValidNumber(Number(key)))
    .sort((a, b) => compare(a, b, null, true));

  const months = Object.keys(entry[years[0]])
    .filter((key) => isValidNumber(Number(key)))
    .sort((a, b) => compare(a, b, null, true));

  const days = Object.keys(entry[years[0]][months[0]])
    .filter((key) => isValidNumber(Number(key)))
    .sort((a, b) => compare(a, b, null, true));

  return new Date(years[0], months[0], days[0]);
};

/**
 * Returns the total time a website's been visited in a given date range. This
 * handles entries that are not populated with data from all included dates.
 * @param {import('./background/store').Entry} entry
 * @param {Date} from
 * @param {Date} to
 */
export const calcTotalTimeInRange = (entry, from, to) => {
  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  let totalTime = 0;

  while (dateFrom <= dateTo) {
    const year = dateFrom.getFullYear();
    const month = dateFrom.getMonth();
    const day = dateFrom.getDate();

    if (typeof entry?.[year]?.[month]?.[day] === "number")
      totalTime += entry[year][month][day];

    dateFrom.setDate(day + 1);
  }

  return totalTime;
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
  firstVisit: new Date(entry.firstVisit).toLocaleString([], dateLocaleOptions),
  totalTime: humanizeDuration(entry.totalTime * 1000, { largest: 2 }),
});

export const logger = {
  info: (msg, ...e) => console.info("[info]", events[msg], ...e),
  error: (msg, ...e) => console.error("[error]", events[msg], ...e),
};

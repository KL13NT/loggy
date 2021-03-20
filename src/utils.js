import humanizeDuration from "humanize-duration";

export const isValidDate = (v) => {
  typeof v === "string" && isNan(new Date(v).valueOf());
};

export const compare = (keyA, keyB, sortby, ascending) => {
  if (ascending) {
    if (sortby === "lastVisit" && isValidDate(keyA) && isValidDate(keyB))
      return new Date(keyA) - new Date(keyB);
    else return keyA < keyB ? -1 : 1;
  } else {
    if (sortby === "lastVisit" && isValidDate(keyA) && isValidDate(keyB))
      return new Date(keyB) - new Date(keyA);
    else return keyB < keyA ? -1 : 1;
  }
};

let dateLocaleOptions = { dateStyle: "full", timeStyle: "short" };

export const humanizeEntry = (entry) => ({
  ...entry,
  lastVisit: new Date(entry.lastVisit).toLocaleString([], dateLocaleOptions),
  totalTime: humanizeDuration(entry.totalTime * 1000, { largest: 2 }),
});

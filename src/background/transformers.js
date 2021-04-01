import { Session, Version } from "../types.d";

class Transformer {
  /**@type {Version} */
  version;

  /**@type {Function} */
  transformer;

  /**
   *
   * @param {Version} version
   * @param {Function} transformer
   */
  constructor(version, transformer) {
    this.version = version;
    this.transform = transformer;
  }
}

const transformerFunctions = {
  "1.0.0": ({ data }) => {
    const transformed = {};

    Object.keys(data).forEach((origin) => {
      const entry = data[origin];
      const sessions = [];
      let totalTime = 0;

      /**
       * -- older format
       * origin
       * last visit: date
       * [date]: [number]
       */

      Object.keys(entry)
        .filter((key) => /\d+/.test(key))
        .forEach((year) => {
          // for each year
          Object.keys(entry[year]).forEach((month) => {
            // for each month
            Object.keys(entry[year][month]).forEach((day) => {
              // for each day
              if (typeof entry[year][month][day] === "number") {
                const date = new Date(year, month, day);
                const duration = entry[year][month][day];

                totalTime += duration;
                sessions.push(new Session(date, duration));
              }
            });
          });
        });

      transformed[origin] = {
        origin,
        sessions,
        totalTime,
      };
    });

    return {
      history: transformed,
      settings: {},
      version: "1.0.0",
    };
  },
};

export const transformers = Object.keys(transformerFunctions).map(
  (versionString) => {
    const version = new Version(versionString);

    return new Transformer(version, transformerFunctions[versionString]);
  },
);

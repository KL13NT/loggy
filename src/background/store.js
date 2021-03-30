/**
 * @typedef {object} Entry
 * @property {Date} lastVisit last visit date
 * @property {Date} firstVisit first visit date
 * @property {object} schedule key is date, value is total time
 */

import { getFirstVisit, logger } from "../utils";

/**
 * @typedef {object} History
 * @property {Entry}
 */

export class Store {
  constructor() {
    /** @type {History} */
    this.data = {};

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);

    this.init();
  }

  async init() {
    if (process.env.NODE_ENV === "development") {
      logger.info("STORE_0000");

      await browser.storage.local.set({
        data: require("../../test/dummy-store.json"),
      });
    }

    const { data } = await browser.storage.local.get("data");

    // Fix for change in data format This piece of code runs only once after
    // installation, populates the firstVisit key, and that's it We can then use
    // firstVisit and lastVisit to filter based on date durations
    Object.keys(data).forEach((origin) => {
      console.log(origin, !data[origin].firstVisit);

      if (!data[origin].firstVisit)
        data[origin] = {
          ...data[origin],
          firstVisit: getFirstVisit(data[origin]),
        };
    });

    await browser.storage.local.set({
      data,
    });
  }

  /**
   * @param {string} origin
   */
  async get(origin) {
    const { data } = await browser.storage.local.get("data");
    return data ? data[origin] : undefined;
  }

  /**
   *
   * @param {string} origin
   * @param {Entry} value
   */
  async set(origin, value) {
    const data = (await browser.storage.local.get("data")).data || {}; // handle first run

    const modified = {
      ...data,
      [origin]: value,
    };

    console.log("modified", modified);
    return browser.storage.local.set({ data: modified });
  }

  /**
   * @param {Error} error
   */
  async logError(error) {
    const errors = (await browser.storage.local.get("errors")).errors || [];
    await browser.storage.local.set({ errors: [...errors, error] });
  }
}

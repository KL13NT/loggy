/**
 * @typedef {object} Entry
 * @property {Date} lastVisit last visit date
 * @property {object} schedule key is date, value is total time
 */

/**
 * @typedef {object} History
 * @property {Entry}
 */

/**
 * /origin
 * /last visit: date
 * /schedule
 *  /2021-05-06: ms total
 *  /2021-05-07: ms total
 *  /2021-05-08: ms total
 */

export class Store {
  constructor() {
    /** @type {History} */
    this.data = {};

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }

  /**
   * TODO: This will cause data inconsistency if users open more than 1 window
   * at the same time since each will have a different local copy that isn't
   * synced with the other windows. Replace it.
   *
   * You could change the tracking logic so that you track only the focused
   * window as well. This would prevent race conditions.
   */

  /**
   * @param {string} origin
   */
  async get(origin) {
    const data = (await browser.storage.local.get("data")).data;
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

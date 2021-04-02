import { Logger } from "../utils";

export class Store {
  constructor() {
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }

  /**
   * @param {string} origin
   */
  async getOrigin(origin) {
    Logger.info("STORE_0001", origin);

    const { history } = await browser.storage.local.get("history");
    return history ? history[origin] : undefined;
  }

  /**
   *
   * @param {string} origin
   * @param {Entry} value
   */
  async setOrigin(origin, value) {
    Logger.info("STORE_0000", origin);

    const { history } = await browser.storage.local.get("history");

    const modified = {
      ...history,
      [origin]: value,
    };

    return browser.storage.local.set({ history: modified });
  }

  /**
   * @param {Error} error
   */
  async logError({ message }) {
    Logger.error("STORE_0000", message);

    const { errors } = await browser.storage.local.get("errors");

    await browser.storage.local.set({
      errors: [...errors, message],
    });
  }
}

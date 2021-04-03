// eslint-disable-next-line no-unused-vars
import { Entry } from "../types.d";
import { Logger } from "../utils";

export class Store {
  constructor() {
    if (this.constructor === Store)
      throw new Error("Can't instantiate abstract class!");
  }

  set = () => {
    throw new Error("Can't use abstract method!");
  };

  get = () => {
    throw new Error("Can't use abstract method!");
  };

  /**
   * @param {Error} error
   */
  static logError = async ({ message }) => {
    Logger.error("STORE_0000", message);

    const { errors } = await browser.storage.local.get("errors");

    await browser.storage.local.set({
      errors: [...errors, message],
    });
  };
}

export class HistoryStore extends Store {
  /**
   * @param {string} origin
   * @returns {Promise<(Entry[]|undefined)>}
   */
  get = async (origin) => {
    const { history } = await browser.storage.local.get("history");
    return history ? history[origin] : undefined;
  };

  /**
   * @param {string} origin
   * @param {Entry} value
   */
  set = async (origin, value) => {
    Logger.info("STORE_0000", origin);

    const { history } = await browser.storage.local.get("history");

    const modified = {
      ...history,
      [origin]: value,
    };

    return browser.storage.local.set({ history: modified });
  };
}

export class IndexStore extends Store {
  /**
   * @param {string} indexKey
   * @returns {Promise<(string[]|undefined)>}
   */
  get = async (indexKey) => {
    const { index } = await browser.storage.local.get("index");
    return index[indexKey];
  };

  /**
   * @param {string} indexKey
   * @param {string} origin
   * @returns {Promise<boolean>}
   */
  isOriginIndexed = async (indexKey, origin) => {
    const { index } = await browser.storage.local.get("index");
    return index[indexKey].includes(origin);
  };

  /**
   * @param {string} indexKey
   * @param {string} origin
   */
  set = async (indexKey, origin) => {
    Logger.info("STORE_0001", indexKey, origin);

    const result = await browser.storage.local.get("index");

    const { index } = result;

    if (!index[indexKey]) index[indexKey] = [origin];
    else if (!index[indexKey].includes(origin)) index[indexKey].push(origin);

    return browser.storage.local.set({ index });
  };
}

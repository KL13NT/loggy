import { Datastore, Version } from "../types.d";
import { logger } from "../utils";
import { transformers } from "./transformers";

export class SchemaManager {
  listeners = {
    ready: [],
  };

  constructor() {
    browser.runtime.onInstalled.addListener(this.updateListener);
    browser.runtime.onInstalled.addListener(this.installListener);
  }

  onReady = {
    addListener: (listener) => this.listeners.ready.push(listener),
    invoke: () => this.listeners.ready.forEach((listener) => listener.call()),
  };

  /**
   *
   * @param {browser.runtime._OnInstalledDetails} details
   */
  updateListener = async (details) => {
    try {
      if (details.reason !== "update") return;

      logger.info("RUNTIME_0001");

      const store = await browser.storage.local.get();
      const prev = new Version(store.version || "0.0.0");

      const { error } = Datastore.schema.validate(store);

      if (!error) {
        this.onReady.invoke();
        return;
      }

      logger.info("SCHEMA_0000", Datastore.schema.validate(store).error);
      logger.info("SCHEMA_0001");

      const transformed = transformers
        .filter(({ version }) => this.compare(version, prev) === 1)
        .reduce((data, transformer) => {
          // apply each valid transformer in series
          return transformer.transform(data);
        }, store);

      browser.storage.local.set(new Datastore(transformed));

      this.onReady.invoke();
    } catch (error) {
      logger.error("ERR_0000", error);
    }
  };

  /**
   *
   * @param {browser.runtime._OnInstalledDetails} details
   */
  installListener = async (details) => {
    try {
      if (details.reason !== "install") return;

      logger.info("RUNTIME_0000");
      logger.info("SCHEMA_0002");

      await browser.storage.local.set(new Datastore());
      this.onReady.invoke();
    } catch (error) {
      this.logError(error);
    }
  };

  /**
   * Compares versions and returns a boolean indicating which is bigger
   * @returns 0 if equal, +1 if versionA, -1 otherwise
   * @param {import("../types.d").Version} versionA
   * @param {import("../types.d").Version} versionB
   */
  compare = (versionA, versionB) => {
    const a = versionA.toString().split(".");
    const b = versionB.toString().split(".");

    for (let i = 0; i < 3; i++) {
      const na = Number(a[i]);
      const nb = Number(b[i]);

      if (na > nb) return 1;
      if (nb > na) return -1;
    }

    return 0;
  };
}

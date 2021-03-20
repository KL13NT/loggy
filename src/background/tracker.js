import { Store } from "./store.js";

const { tabs } = browser; /* || chrome */

const SYNC_TIME = 5; // sync every 5 secs

const shouldSync = (state) => state.origin;

export class Tracker {
  /**
   *
   * @param {Store} store
   */
  constructor(store) {
    this.store = store;
    this.tracking = {
      id: 0,
      origin: null,
    };

    this.onActivated = this.onActivated.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
    this.onRemoved = this.onRemoved.bind(this);
    this.resetTracking = this.resetTracking.bind(this);
    this.startTracking = this.startTracking.bind(this);

    tabs.onActivated.addListener(this.onActivated);
    tabs.onUpdated.addListener(this.onUpdated);
    tabs.onRemoved.addListener(this.onRemoved);

    this.startTracking();
  }

  startTracking() {
    clearInterval(this.interval);

    this.interval = setInterval(async () => {
      try {
        if (
          !(await browser.windows.getCurrent()).focused ||
          !this.tracking.origin
        )
          return; // make sure browser is focused

        if (!shouldSync(this.tracking)) return; // sync every 5 secs

        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();

        // fix for wasted updates
        const found = await this.store.get(this.tracking.origin);

        if (found) {
          found[year][month][day] += SYNC_TIME;
          found.lastVisit = new Date();
          found.totalTime += SYNC_TIME;

          await this.store.set(this.tracking.origin, found);
        } else {
          const website = {};

          website[year] = {};
          website[year][month] = {};
          website[year][month][day] = SYNC_TIME;

          website.totalTime = SYNC_TIME;
          website.lastVisit = new Date();

          await this.store.set(this.tracking.origin, website);
        }
      } catch (error) {
        console.log(error);
        this.store.logError(error);
      }
    }, 5 * 1000);
  }

  resetTracking() {
    if (this.tracking.origin)
      this.tracking = {
        id: 0,
        origin: null,
      };
  }

  /**
   * FIXME: race condition onUpdated
   * If user enters url and switches to other tab, the one loading will fire
   * onUpdated events.
   */

  /**
   * @param {browser.tabs._OnActivatedActiveInfo} info
   */
  async onActivated(info) {
    try {
      const { url, id } = await tabs.get(info.tabId);

      if (!url) {
        this.resetTracking(); // reset on origin change
        return;
      }

      const { hostname } = new URL(url);

      if (this.tracking.origin !== hostname) this.resetTracking(); // reset on origin change

      this.tracking = {
        id,
        origin: hostname,
      };

      this.startTracking();
    } catch (error) {
      console.log(error);
      this.store.logError(error);
    }
  }

  /**
   *
   * @param {number} tabId
   * @param {browser.tabs._OnUpdatedChangeInfo} changeInfo
   * @param {browser.tabs.Tab} tab
   */
  async onUpdated(tabId, changeInfo, tab) {
    try {
      const { url, id } = tab;

      if (!url) {
        this.resetTracking(); // reset on URL change
        return;
      }

      const { hostname } = new URL(url);

      console.log(hostname, this.tracking.origin);
      if (this.tracking.origin !== hostname) this.resetTracking(); // reset on origin change

      this.tracking = {
        id,
        origin: hostname,
      };

      this.startTracking();
    } catch (error) {
      console.log(error);
      this.store.logError(error);
    }
  }

  /**
   *
   * @param {number} tabId
   * @param {browser.tabs._OnRemovedRemoveInfo} removeInfo
   */
  async onRemoved(tabId, removeInfo) {
    try {
      if (!this.tracking.id === tabId) return;

      this.resetTracking();
      this.startTracking();
    } catch (error) {
      console.log(error);
      this.store.logError(error);
    }
  }
}

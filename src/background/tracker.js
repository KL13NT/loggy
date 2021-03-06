import { logger } from "../utils";

const { tabs, windows } = browser; /* || chrome */
const { info, error } = logger;

const shouldSync = (state) => state.tracking && state.origin && state.focused;

const isValidNumber = (v) => typeof v === "number" && !isNaN(v);

export class Tracker {
  /**
   *
   * @param {import('./store').Store} store
   */
  constructor(store) {
    this.store = store;
    this.state = {
      tabId: 0,
      origin: null,
      focused: true,
    };

    this.onActivated = this.onActivated.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
    this.onRemoved = this.onRemoved.bind(this);
    this.onFocusChanged = this.onFocusChanged.bind(this);
    this.resetTracking = this.resetTracking.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.clearInterval = this.clearInterval.bind(this);

    tabs.onActivated.addListener(this.onActivated);
    tabs.onUpdated.addListener(this.onUpdated);
    tabs.onRemoved.addListener(this.onRemoved);
    windows.onFocusChanged.addListener(this.onFocusChanged);

    this.startTracking();
  }

  /**
   * @param {number} id
   */
  onFocusChanged(id) {
    if (id === windows.WINDOW_ID_NONE) {
      info("FOCUS_0000", id);

      this.resetTracking();
      this.state.focused = false;
    } else {
      info("FOCUS_0001", id);

      this.resetTracking();

      this.state.focused = true;
      this.startTracking();
    }
  }

  /**
   * TODO: restart interval on context switch
   */

  startTracking() {
    info("TRACKING_0005");

    const SYNC_TIME = 5; // sync every 5 secs
    this.state.tracking = true;

    this.interval = setInterval(async () => {
      try {
        if (!shouldSync(this.state)) {
          if (!this.state.focused) info("FOCUS_0002");
          else if (!this.state.origin) info("TRACKING_0000");
          else if (!this.state.tracking) info("TRACKING_0019");

          return;
        }

        info("TRACKING_0001", this.state.origin);

        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();

        // fix for wasted updates
        const found = await this.store.get(this.state.origin);

        if (isValidNumber(found?.[year]?.[month]?.[day])) {
          info("TRACKING_0002", this.state.origin);

          found[year][month][day] += SYNC_TIME;
          found.lastVisit = new Date();
          found.totalTime += SYNC_TIME;

          await this.store.set(this.state.origin, found);
        } else {
          info("TRACKING_0003", origin);
          info("TRACKING_0004", origin);

          const website = found || {};

          if (!website[year]) {
            info("TRACKING_0020");
            website[year] = {};
          }

          if (!website[year][month]) {
            info("TRACKING_0021");
            website[year][month] = {};
          }

          if (!isValidNumber(website[year][month][day])) {
            info("TRACKING_0022");
            website[year][month][day] = SYNC_TIME;
          }

          if (!isValidNumber(website.totalTime)) {
            info("TRACKING_0023");
            website.totalTime = SYNC_TIME;
          } else {
            info("TRACKING_0024");
            website.totalTime += SYNC_TIME;
          }

          info("TRACKING_0025");
          website.lastVisit = new Date();

          await this.store.set(this.state.origin, website);
        }
      } catch (err) {
        error("ERR_0000", err);
        this.store.logError(err);
      }
    }, SYNC_TIME * 1000);

    info("TRACKING_0018", this.interval);
  }

  clearInterval() {
    info("TRACKING_0017", this.interval);
    clearInterval(this.interval);
  }

  resetTracking() {
    this.state = {
      ...this.state,
      tracking: false,
    };

    this.clearInterval();
  }

  /**
   * @param {browser.tabs._OnActivatedActiveInfo} activeInfo
   */
  async onActivated(activeInfo) {
    try {
      info("TRACKING_0006");

      const { url, id } = await tabs.get(activeInfo.tabId);

      info("TRACKING_0016");
      this.state.tabId = id;

      if (!url) {
        info("TRACKING_0007");
        this.resetTracking(); // reset on origin change
        return;
      }

      const { hostname } = new URL(url);

      if (this.state.origin !== hostname) {
        info("TRACKING_0008");
        this.resetTracking();

        this.state.origin = hostname;

        this.startTracking();
      } // reset on origin change
      else info("TRACKING_0009", this.state.origin);
    } catch (err) {
      error("ERR_0000", err);
      this.store.logError(err);
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
      info("TRACKING_0010", tabId);

      if (this.state.tabId !== tabId) {
        info("TRACKING_0011", tabId);
        return;
      }

      const { url } = tab;

      if (!url) {
        info("TRACKING_0012", tabId);
        this.resetTracking(); // reset on URL change
        return;
      }

      const { hostname } = new URL(url);

      info("TRACKING_0013", tabId, hostname);
      if (this.state.origin !== hostname) {
        this.resetTracking(); // reset on origin change

        this.state.origin = hostname;

        this.startTracking();
      }
    } catch (err) {
      error("ERR_0000", err);
      this.store.logError(err);
    }
  }

  /**
   *
   * @param {number} tabId
   * @param {browser.tabs._OnRemovedRemoveInfo} removeInfo
   */
  async onRemoved(tabId) {
    try {
      info("TRACKING_0014", tabId);

      if (this.state.tabId !== tabId) {
        info("TRACKING_0015", tabId);
        return;
      }

      this.resetTracking();
      this.startTracking();
    } catch (err) {
      error("ERR_0000", err);
      this.store.logError(err);
    }
  }
}

// TODO: If a tab is focused and no tracking occurs then track that one
// This is a fix for the installation-time, dev-time, and update-time when the
// extension is reloaded and the user has an active tab

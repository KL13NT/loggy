import { Entry, Session } from "../types.d";
import { dateToIndexKey, Logger } from "../utils";
import { Store } from "./store";

const { tabs, windows } = browser; /* || chrome */
const { info, error } = Logger;

const shouldSync = (state) => state.tracking && state.origin && state.focused;

export class Tracker {
  /**
   * @param {object} param0
   * @param {import('./store').HistoryStore} param0.historyStore
   * @param {import('./store').IndexStore} param0.indexStore
   */
  constructor({ historyStore, indexStore }) {
    this.historyStore = historyStore;
    this.indexStore = indexStore;
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
      info("TRACKING_0026", id);

      this.resetTracking();
      this.state.focused = false;
    } else {
      info("TRACKING_0027", id);

      this.resetTracking();

      this.state.focused = true;
      this.startTracking();
    }
  }

  startTracking() {
    info("TRACKING_0005");

    const SYNC_TIME = 5; // sync every 5 secs
    this.state.tracking = true;

    this.interval = setInterval(async () => {
      //TODO: update index
      try {
        if (!shouldSync(this.state)) {
          if (!this.state.focused) info("TRACKING_0028");
          else if (!this.state.origin) info("TRACKING_0000");
          else if (!this.state.tracking) info("TRACKING_0019");

          return;
        }

        info("TRACKING_0001", this.state.origin);

        /**@type {import("../types.d").Entry} */
        const found = await this.historyStore.get(this.state.origin);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const indexKey = dateToIndexKey(today);
        const isIndexed = await this.indexStore.isOriginIndexed(
          indexKey,
          origin,
        );

        if (found) {
          info("TRACKING_0002", this.state.origin);

          if (isIndexed) {
            const session = found.sessions.find(
              (session) => session.date.getTime() === today.getTime(),
            );

            info("TRACKING_0030", this.state.origin);
            info("TRACKING_0031", this.state.origin);

            session.duration += SYNC_TIME;
            found.totalTime += SYNC_TIME;

            await this.historyStore.set(this.state.origin, found);
          } else {
            info("TRACKING_0029", this.state.origin);

            const session = new Session(today, SYNC_TIME);
            found.sessions.push(session);
            found.totalTime += SYNC_TIME;

            await this.historyStore.set(this.state.origin, found);
            await this.indexStore.set(indexKey, origin);
          }
        } else {
          info("TRACKING_0003", origin);
          info("TRACKING_0004", origin);

          const sessions = [new Session(today, SYNC_TIME)];

          const website = new Entry(this.state.origin, sessions, SYNC_TIME);

          await this.historyStore.setOrigin(this.state.origin, website);
          await this.indexStore.set(indexKey, origin);
        }
      } catch (err) {
        error("ERR_0000", err);
        Store.logError(err);
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
      Store.logError(err);
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
      Store.logError(err);
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
      Store.logError(err);
    }
  }
}

// TODO: If a tab is focused and no tracking occurs then track that one
// This is a fix for the installation-time, dev-time, and update-time when the
// extension is reloaded and the user has an active tab

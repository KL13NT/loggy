import humanizeDuration from "humanize-duration";
import { dateToIndexKey, humanizeDate } from "../utils.js";
import { HistoryStore, IndexStore } from "../background/store";

const historyStore = new HistoryStore();
const indexStore = new IndexStore();

const today = new Date();
today.setHours(0, 0, 0);

const indexKey = dateToIndexKey(today);

export default {
  name: "app",
  data: function () {
    return {
      history: [],
      today,
      total: 0,
    };
  },
  mounted: async function () {
    const visitedOrigins = await indexStore.get(indexKey);

    if (!visitedOrigins) return;

    const history = await historyStore.getAll();
    const entries = visitedOrigins.map((origin) => history[origin]);

    this.history = entries
      .map((entry) => ({
        origin: entry.origin,
        totalTime: entry.sessions[entry.sessions.length - 1].duration,
      }))
      .slice(0, 5)
      .sort((a, b) => b.totalTime - a.totalTime);

    this.total = this.history.reduce((t, c) => t + c.totalTime, 0);
  },
  methods: {
    openOptionsPage: () => browser.runtime.openOptionsPage(),
    humanizeDuration,
    humanizeDate,
  },
};

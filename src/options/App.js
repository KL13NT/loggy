import humanizeDuration from "humanize-duration";
import { HistoryStore } from "../background/store";
import { humanizeDate } from "../utils.js";

const historyStore = new HistoryStore();

export default {
  name: "app",
  data: function () {
    return {
      history: [],
      sortby: "totalTime",
      ascending: false,
      search: "",
    };
  },
  mounted: async function () {
    const history = await historyStore.getAll();

    this.history = Object.keys(history)
      .map((key) => history[key])
      .sort((a, b) => b.totalTime - a.totalTime);
  },
  computed: {
    result: function () {
      return Array.from(this.history).filter((entry) =>
        entry.origin.includes(this.search),
      );
    },
  },
  methods: {
    humanizeDuration,
    humanizeDate,
  },
};

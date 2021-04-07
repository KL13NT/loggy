import { SchemaManager } from "./schema-manager.js";
import { HistoryStore, IndexStore } from "./store.js";
import { Tracker } from "./tracker.js";

const schemaManager = new SchemaManager();

const historyStore = new HistoryStore();
const indexStore = new IndexStore();
const tracker = new Tracker({ historyStore, indexStore });

schemaManager.onInstalled.addListener(() => {
  tracker.resetTracking();
});

schemaManager.onReady.addListener(() => {
  tracker.startTracking();
});

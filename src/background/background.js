import { SchemaManager } from "./schema-manager.js";
import { HistoryStore, IndexStore } from "./store.js";
import { Tracker } from "./tracker.js";

const schemaManager = new SchemaManager();

schemaManager.onReady.addListener(() => {
  const historyStore = new HistoryStore();
  const indexStore = new IndexStore();

  new Tracker({ historyStore, indexStore });
});

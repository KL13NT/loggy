import { SchemaManager } from "./schema-manager.js";
import { Store } from "./store.js";
import { Tracker } from "./tracker.js";

const schemaManager = new SchemaManager();

schemaManager.onReady.addListener(() => {
  const store = new Store();
  new Tracker(store);
});

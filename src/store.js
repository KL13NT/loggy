export class Store {
  constructor() {}

  get(key = "data") {
    return browser.storage.local.get(key);
  }

  set(key = "data", value) {
    return browser.storage.local.get(key, value);
  }
}

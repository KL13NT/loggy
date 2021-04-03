import Joi from "joi";

/**
 * @typedef {Object.<string, string[]>} Index
 */

export class Session {
  /**@type {Date} */
  date = null;
  /**@type {number} */
  duration = null;

  static schema = Joi.object({
    date: Joi.date().required(),
    duration: Joi.number().required(),
  });

  /**
   *
   * @param {Date} date
   * @param {number} duration
   */
  constructor(date, duration) {
    this.date = date;
    this.duration = duration;
  }
}

export class Entry {
  /**@type {string} */
  origin = null;
  /**@type {number} */
  totalTime = 0;
  /**@type {Session[]} */
  sessions = [];

  static schema = Joi.object({
    origin: Joi.string().required(),
    totalTime: Joi.number().required(),
    sessions: Joi.array().items(Session.schema).required(),
  });

  /**
   *
   * @param {string} origin
   * @param {Session[]} sessions
   * @param {number} totalTime
   */
  constructor(origin, sessions, totalTime) {
    this.origin = origin;
    this.sessions = sessions;
    this.totalTime = totalTime;
  }
}

export class Version {
  major = 0;
  minor = 0;
  patch = 0;

  /**
   * @param {string} version
   */
  constructor(version) {
    const [major, minor, patch] = version.replace("v", "").split(".");

    this.major = Number(major);
    this.minor = Number(minor);
    this.patch = Number(patch);
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
}

export class Datastore {
  version = "1.0.0";
  history = {};
  errors = [];
  settings = {};
  index = {}; // date to array of visited links on that day

  static schema = Joi.object({
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/),
    history: Joi.object().pattern(Joi.string(), Entry.schema).required(),
    errors: Joi.array().items(Joi.string()).required(),
    settings: Joi.object().required(),
    index: Joi.object()
      .pattern(Joi.string(), Joi.array().items(Joi.string()))
      .required(),
  });

  constructor(store) {
    if (store) {
      const { error } = Datastore.schema.validate(store);

      if (error) throw new Error(error);

      Object.keys(store).forEach((key) => (this[key] = store[key]));
    }
  }
}

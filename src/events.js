/**
 * -- LEGEND
 * FOCUS for focus-related events
 * TRACKING for general tracking events
 *  */

export default {
  ERR_0000: "Something went wrong.",

  FOCUS_0000: "Focus changed. No windows are focused.",
  FOCUS_0001: "Focus moved to another window.",
  FOCUS_0002: "Browser not focused.",

  TRACKING_0000: "Not tracking an origin.",
  TRACKING_0001: "Syncing.",
  TRACKING_0002: "Origin exists in DB.",
  TRACKING_0003: "Couldn't find origin in DB.",
  TRACKING_0004: "Initializing origin in DB.",
  TRACKING_0005: "Started logging.",
  TRACKING_0006: "Active tab changed.",
  TRACKING_0007: "Activated tab doesn't have a origin. Resetting tracking.",
  TRACKING_0008: "Activated tab has a different origin. Resetting tracking.",
  TRACKING_0009: "Activated tab has same origin.",
  TRACKING_0010: "Tab update fired.",
  TRACKING_0011: "Updated tab ignored.",
  TRACKING_0012: "Updated tab doesn't have a origin. Resetting tracking.",
  TRACKING_0013: "Updated tab has a origin.",
  TRACKING_0014: "A tab has been removed.",
  TRACKING_0015: "Removed tab is ignored.",
  TRACKING_0016: "Updating tracked tabId.",
  TRACKING_0017: "Clearing interval.",
  TRACKING_0018: "Starting new interval.",
  TRACKING_0019: "Not tracking.",
  TRACKING_0020: "No year found.",
  TRACKING_0021: "No month found.",
  TRACKING_0022: "Day invalid.",
  TRACKING_0023: "totalTime invalid. Initializing.",
  TRACKING_0024: "totalTime valid. Incrementing.",
  TRACKING_0025: "Updating lastVisit.",
};

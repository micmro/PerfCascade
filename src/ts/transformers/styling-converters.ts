import {RequestType, TimingType} from "../typing/waterfall";

/**
 * Convert a RequestType into a CSS class
 * @param {RequestType} requestType
 */
export function requestTypeToCssClass(requestType: RequestType) {
  return "block-" + requestType;
}

/**
 * Convert a TimingType into a CSS class
 * @param {TimingType} timingType
 */
export function timingTypeToCssClass(timingType: TimingType) {
  return "block-" + timingType;
}

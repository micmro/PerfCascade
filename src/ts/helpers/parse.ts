import { ChartRenderOption } from "../typing/options";
import { roundNumber } from "./misc";

/**
 * Type safe and null safe way to transform, filter and format an input value, e.g. parse a Date from a string,
 * rejecting invalid dates, and formatting it as a localized string. If the input value is undefined, or the parseFn
 * returns undefined, the function returns undefined.
 * @param input
 * @param parseFn an optional function to transform and/or filter the input value.
 * @param formatFn an optional function to format the parsed input value.
 * @returns {string} a formatted string representation of the input, or undefined.
 */
export function parseAndFormat<S, T>(input?: S,
                                     parseFn: ((_: S) => T) = identity,
                                     formatFn: ((_: T) => string) = toString): string {
  if (input === undefined) {
    return undefined;
  }
  const parsed = parseFn(input);
  if (parsed === undefined) {
    return undefined;
  }
  return formatFn(parsed);
}

/** Fallback dummy function - just maintains the type */
function identity<T>(source: T): T {
  return source;
}

function toString<T>(source: T): string {
  if (typeof source["toString"] === "function") {
    return source.toString();
  } else {
    throw TypeError("Can't convert type ${typeof source} to string");
  }
}

export function parseNonEmpty(input: string): string {
  return input.trim().length > 0 ? input : undefined;
}

export function parseDate(input: string): Date {
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    return undefined;
  }
  return date;
}

export function parseNonNegative(input: string | number): number {
  const filter = (n) => (n >= 0);
  return parseToNumber(input, filter);
}

export function parsePositive(input: string | number): number {
  const filter = (n) => (n > 0);
  return parseToNumber(input, filter);
}

function parseToNumber(input: string | number, filterFn: (_: number) => boolean): number {
  const filter = (n: number) => filterFn(n) ? n : undefined;

  if (typeof input === "string") {
    const n = parseInt(input, 10);
    if (!isFinite(n)) {
      return undefined;
    }
    return filter(n);
  }
  return filter(input);
}

export function formatMilliseconds(millis: number): string {
  return `${roundNumber(millis, 3)} ms`;
}

const secondsPerMinute = 60;
const secondsPerHour = 60 * secondsPerMinute;
const secondsPerDay = 24 * secondsPerHour;

export function formatSeconds(seconds: number): string {
  const raw = `${roundNumber(seconds, 3)} s`;
  if (seconds > secondsPerDay) {
    return `${raw} (~${roundNumber(seconds / secondsPerDay, 0)} days)`;
  }
  if (seconds > secondsPerHour) {
    return `${raw} (~${roundNumber(seconds / secondsPerHour, 0)} hours)`;
  }
  if (seconds > secondsPerMinute) {
    return `${raw} (~${roundNumber(seconds / secondsPerMinute, 0)} minutes)`;
  }
  return raw;
}

export function formatDateLocalized(date: Date): string {
  return `${date.toUTCString()}<br/>(local time: ${date.toLocaleString()})`;
}

const bytesPerKB = 1024;
const bytesPerMB = 1024 * bytesPerKB;

export function formatBytes(bytes: number): string {
  const raw = `${bytes} bytes`;
  if (bytes >= bytesPerMB) {
    return `${raw} (~${roundNumber(bytes / bytesPerMB, 1)} MB)`;
  }
  if (bytes >= bytesPerKB) {
    return `${raw} (~${roundNumber(bytes / bytesPerKB, 0)} kB)`;
  }
  return raw;
}

/** HTML character to escape */
const htmlCharMap = {
  "\"": "&quot",
  "&": "&amp",
  "'": "&#039",
  "<": "&lt",
  ">": "&gt",
};
/**
 * Reusable regex to escape HTML chars
 * Combined to improve performance
 */
const htmlChars = new RegExp(Object.keys(htmlCharMap).join("|"), "g");

/**
 * Escapes unsafe characters in a string to render safely in HTML
 * @param  {string} unsafe - string to be rendered in HTML
 */
export function escapeHtml(unsafe: string | number | boolean = ""): string {
  if (typeof unsafe !== "string") {
    if (typeof unsafe["toString"] === "function") {
      unsafe = unsafe.toString();
    } else {
      throw TypeError("Invalid parameter");
    }
  }
  return unsafe.replace(htmlChars, (match) => {
    return htmlCharMap[match];
  });
}

/** Whitelist of save-ish URL chars */
const unSafeUrlChars = new RegExp("[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]", "g");

/** returns a cleaned http:// or https:// based URL  */
export function sanitizeUrlForLink(unsafeUrl: string) {
  const cleaned = unsafeUrl.replace(unSafeUrlChars, "_");
  if (cleaned.indexOf("http://") === 0 || cleaned.indexOf("https://") === 0) {
    return cleaned;
  }
  console.warn("skipped link, due to potentially unsafe url", unsafeUrl);
  return "";
}

/** whitelist basic chars */
const requestTypeTypeRegEx = new RegExp("[^a-zA-Z0-9]", "g");

/**  returns cleaned sting - stipps out not a-zA-Z0-9 */
export function sanitizeAlphaNumeric(unsafe: string | number) {
  return unsafe.toString().replace(requestTypeTypeRegEx, "");
}

/** Ensures `input` is casted to `number` */
export function toInt(input: string | number): number {
  if (typeof input === "number") {
    return input;
  } else if (typeof input === "string") {
    return parseInt(input, 10);
  } else {
    return undefined;
  }
}

/** Validates the `ChartOptions` attributes types */
export function validateOptions(options: ChartRenderOption): ChartRenderOption {
  const validateInt = (name: keyof ChartRenderOption) => {
    options[name] = toInt(options[name] as any);
    if (options[name] === undefined) {
      throw TypeError(`option "${name}" needs to be a number`);
    }
  };
  const ensureBoolean = (name: keyof ChartRenderOption) => {
    options[name] = !!options[name];
  };

  validateInt("leftColumnWith");
  validateInt("rowHeight");
  validateInt("selectedPage");
  ensureBoolean("showAlignmentHelpers");
  ensureBoolean("showIndicatorIcons");
  ensureBoolean("showMimeTypeIcon");

  return options;
}

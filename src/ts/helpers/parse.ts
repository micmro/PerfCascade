import {roundNumber} from "./misc";

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
                                     formatFn: ((_: T) => string) = identity): string {
  if (input === undefined) {
    return undefined;
  }
  const parsed = parseFn(input);
  if (parsed === undefined) {
    return undefined;
  }
  return formatFn(parsed);
}

function identity<T>(source: T): T {
  return source;
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

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

export function formatSeconds(seconds: number): string {
  const raw = `${roundNumber(seconds, 3)} s`;
  if (seconds > SECONDS_PER_DAY) {
    return `${raw} (~${roundNumber(seconds / SECONDS_PER_DAY, 0)} days)`;
  }
  if (seconds > SECONDS_PER_HOUR) {
    return `${raw} (~${roundNumber(seconds / SECONDS_PER_HOUR, 0)} hours)`;
  }
  if (seconds > SECONDS_PER_MINUTE) {
    return `${raw} (~${roundNumber(seconds / SECONDS_PER_MINUTE, 0)} minutes)`;
  }
  return raw;
}

export function formatDateLocalized(date: Date): string {
  return `${date.toUTCString()}</br>(local time: ${date.toLocaleString()})`;
}

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * BYTES_PER_KB;

export function formatBytes(bytes: number): string {
  const raw = `${bytes} bytes`;
  if (bytes >= BYTES_PER_MB) {
    return `${raw} (~${roundNumber(bytes / BYTES_PER_KB, 1)} MB)`;
  }
  if (bytes >= BYTES_PER_KB) {
    return `${raw} (~${roundNumber(bytes / BYTES_PER_KB, 0)} kB)`;
  }
  return raw;
}

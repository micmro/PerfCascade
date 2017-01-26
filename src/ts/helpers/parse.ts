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
  return `${millis} ms`;
}

export function formatDateLocalized(date: Date): string {
  return `${date.toUTCString()}</br>(local time: ${date.toLocaleString()})`;
}

export function formatBytes(bytes: number): string {
  return `${bytes} bytes (~${roundNumber(bytes / 1024, 1)} kb)`;
}

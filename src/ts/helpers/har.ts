import { Header } from "har-format";
import { KvTuple } from "../typing/waterfall";

/** Partial function that buils a filter predicate function */
const matchHeaderPartialFn = (lowercaseName: string): (header: Header) => boolean => {
  return (header: Header) => header.name.toLowerCase() === lowercaseName;
};

/**
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
export function hasHeader(headers: Header[], headerName: string): boolean {
  const headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
  return headers.some(headerFilter);
}

/** feature detection if browser supports `find` for arrays */
const browserHasFind = !!Array.prototype["find"];
/**
 * Returns the fist instances of `headerName` in `headers`
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
export function getHeader(headers: Header[], headerName: string): string {
  const headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
  let firstItem;
  if (browserHasFind) {
    firstItem = headers["find"](headerFilter);
  } else {
    firstItem = headers.map(headerFilter).pop();
  }
  return firstItem ? firstItem.value : undefined;
}

/**
 * Returns all instances of `headerName` in `headers` as `KvTuple`
 * @param headers List of `Header` to search in
 * @param headerName Name of `Header` to find
 */
export function getHeaders(headers: Header[], headerName: string): KvTuple[] {
  const headerFilter = matchHeaderPartialFn(headerName.toLowerCase());
  return headers.filter(headerFilter).map((h) => [headerName, h.value] as KvTuple);
}

import {Header} from "har-format";

function matchHeaderFilter(lowercaseName: string): (header: Header) => boolean {
  return (header: Header) => header.name.toLowerCase() === lowercaseName;
}

export function hasHeader(headers: Header[], headerName: string): boolean {
  const headerFilter = matchHeaderFilter(headerName.toLowerCase());
  return headers.some(headerFilter);
}

export function getHeader(headers: Header[], headerName: string): string {
  const headerFilter = matchHeaderFilter(headerName.toLowerCase());
  const firstMatch = headers.filter(headerFilter).pop();
  return firstMatch ? firstMatch.value : undefined;
}

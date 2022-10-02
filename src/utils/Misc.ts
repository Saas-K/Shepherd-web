import queryString from 'query-string';

export function changeBrowserLocation(history: any, pathname: string, params = {}): void {
  history.push(`${pathname}?${queryString.stringify(params)}`);
}
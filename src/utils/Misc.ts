import { FormInstance } from 'antd';
import queryString from 'query-string';

export function changeBrowserLocation(history: any, pathname: string, params = {}): void {
  history.push(`${pathname}?${queryString.stringify(params)}`);
}

export function countFilter(form: FormInstance<any>): number {
  let count = 0;
  const keys: string[] = Object.keys(form.getFieldsValue());
  for (const key of keys) {
    if (form.getFieldValue(key)) {
      count++;
    }
  }
  return count;
}
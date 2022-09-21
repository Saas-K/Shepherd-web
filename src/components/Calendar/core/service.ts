import { client } from "../../../services/client";
import {
  CALENDAR_DAYS_GET
} from '../../../services/apis';

export async function getDays(year: number, month: number, init: boolean) {
  return client().get(CALENDAR_DAYS_GET, {year, month, init});
}
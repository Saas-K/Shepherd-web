import { client } from "../../../services/client";
import {
  CALENDAR_DAYS_GET, CALENDAR_MAIN_DAYS, CALENDAR_ALT_DAYS, CALENDAR_TOGGLE_CANCEL
} from '../../../services/apis';
import { IMainDay, IDayClassInfo, IToggleCancelClass } from "./types";

export async function getDays(beginYear: number, beginMonth: number, endYear: number, endMonth: number): Promise<any> {
  return client().get(CALENDAR_DAYS_GET, {beginYear, beginMonth, endYear, endMonth});
}

export async function getMainDays(): Promise<any> {
  return client().get(`${CALENDAR_MAIN_DAYS}`);
}

export async function createMainDay(body: IMainDay): Promise<any> {
  return client().post(`${CALENDAR_MAIN_DAYS}`, undefined, body);
}

export async function deleteMainDay(id: string): Promise<any> {
  return client().deletef(`${CALENDAR_MAIN_DAYS}`, {id});
}

export async function createAltDay(body: IDayClassInfo): Promise<any> {
  return client().post(`${CALENDAR_ALT_DAYS}`, undefined, body);
}

export async function toggleCancelClass(body: IToggleCancelClass): Promise<any> {
  return client().post(`${CALENDAR_TOGGLE_CANCEL}`, undefined, body);
}

import { client } from "../../../services/client";
import {
  CALENDAR_DAYS_GET, CALENDAR_MAIN_DAYS, COURSES_GET
} from '../../../services/apis';
import { IMainDay } from "./types";

export async function getDays(year: number, month: number, init: boolean): Promise<any> {
  return client().get(CALENDAR_DAYS_GET, {year, month, init});
}

export async function getMainDays(): Promise<any> {
  return client().get(`${CALENDAR_MAIN_DAYS}`);
}

export async function createMainDay(body: IMainDay): Promise<any> {
  return client().post(`${CALENDAR_MAIN_DAYS}`, undefined, body);
}

export async function getAllCourses(): Promise<any> {
  return client().get(`${COURSES_GET}`, {page: 0, limit: -1});
}
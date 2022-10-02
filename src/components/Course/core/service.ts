import { client } from "../../../services/client";
import {
  COURSES_GET
} from '../../../services/apis';
import { ICourseFilter } from "./types";

export async function getAllCourses(): Promise<any> {
  return client().get(`${COURSES_GET}`, {page: 0, limit: -1});
}

export async function getListCourses(filter: ICourseFilter): Promise<any> {
  return client().get(`${COURSES_GET}`, filter);
}
import { client } from "../../../services/client";
import {
  COURSES_GET
} from '../../../services/apis';
import { ICourse, ICourseFilter } from "./types";

export async function getAllCourses(): Promise<any> {
  return client().get(`${COURSES_GET}`, {page: 0, limit: -1});
}

export async function getListCourses(filter: ICourseFilter): Promise<any> {
  return client().get(`${COURSES_GET}`, filter);
}

export async function getCourse(id: string): Promise<any> {
  return client().get(`${COURSES_GET}/${id}`);
}

export async function updateCourse(id: string, body: ICourse): Promise<any> {
  return client().put(`${COURSES_GET}/${id}`, undefined, body);
}

export async function createCourse(body: ICourse): Promise<any> {
  return client().post(`${COURSES_GET}`, undefined, body);
}
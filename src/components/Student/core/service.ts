import { client } from "../../../services/client";
import {
  STUDENTS_GET
} from '../../../services/apis';
import { IStudent, IStudentFilter } from "./types";

export async function getAllActiveStudents(): Promise<any> {
  return client().get(`${STUDENTS_GET}`, {page: 0, limit: -1, active: true});
}

export async function getListStudents(filter: IStudentFilter): Promise<any> {
  return client().get(`${STUDENTS_GET}`, filter);
}

export async function getStudent(id: string): Promise<any> {
  return client().get(`${STUDENTS_GET}/${id}`);
}

export async function updateStudent(id: string, body: IStudent): Promise<any> {
  return client().put(`${STUDENTS_GET}/${id}`, undefined, body);
}

export async function createStudent(body: IStudent): Promise<any> {
  return client().post(`${STUDENTS_GET}`, undefined, body);
}
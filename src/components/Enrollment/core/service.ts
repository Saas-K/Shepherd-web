import { client } from "../../../services/client";
import {
  ENROLLMENTS_GET
} from '../../../services/apis';
import { IEnrollment, IEnrollmentFilter } from "./types";

export async function getListEnrollments(filter: IEnrollmentFilter): Promise<any> {
  return client().get(`${ENROLLMENTS_GET}`, filter);
}

export async function getAllEnrollments(): Promise<any> {
  return client().get(`${ENROLLMENTS_GET}`, {page: 0, limit: -1});
}

export async function getEnrollment(id: string): Promise<any> {
  return client().get(`${ENROLLMENTS_GET}/${id}`);
}

export async function updateEnrollment(id: string, body: IEnrollment): Promise<any> {
  return client().put(`${ENROLLMENTS_GET}/${id}`, undefined, body);
}

export async function createEnrollment(body: IEnrollment): Promise<any> {
  return client().post(`${ENROLLMENTS_GET}`, undefined, body);
}
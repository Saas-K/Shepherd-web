import { client } from "../../../services/client";
import {
  PAYMENTS_GET
} from '../../../services/apis';
import { IPayment, IPaymentFilter } from "./types";

export async function getListPayments(filter: IPaymentFilter): Promise<any> {
  return client().get(`${PAYMENTS_GET}`, filter);
}

export async function getPayment(id: string): Promise<any> {
  return client().get(`${PAYMENTS_GET}/${id}`);
}

export async function updatePayment(id: string, body: IPayment): Promise<any> {
  return client().put(`${PAYMENTS_GET}/${id}`, undefined, body);
}

export async function createPayment(body: IPayment): Promise<any> {
  return client().post(`${PAYMENTS_GET}`, undefined, body);
}
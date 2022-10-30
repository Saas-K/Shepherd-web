import { clientNoAuth } from "../../../services/client";
import {
  LOGIN
} from '../../../services/apis';
import { ILogin } from "./types";

export async function login(body: ILogin): Promise<any> {
  return clientNoAuth().post(LOGIN, undefined, body);
}
import axios from 'axios'
import {BASE_URL} from "../../settings/ReactNative";

export const ajax = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
})

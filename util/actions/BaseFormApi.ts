import { BaseApi } from './BaseApi'
import {GetState} from "../redux/rootStore";

class BaseFormApi<GET = any, SUBMIT = any> extends BaseApi {
    get = async (data?: any, getState?: GetState): Promise<GET> => {
        throw new Error(
            'You need to override the get() function to extend this class'
        )
        // noinspection UnreachableCodeJS
    };

    submit = async (data: any, getState?: GetState): Promise<SUBMIT> => {
        throw new Error(
            'You need to override the submit() function to extend this class'
        )
        // noinspection UnreachableCodeJS
    }
}

export { BaseFormApi }

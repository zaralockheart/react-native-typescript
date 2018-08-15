import {getNamespacedType as utilGetNamespacedType} from '../reduxTools'
import {Action} from 'redux'
import * as _ from 'lodash'
import {AxiosError} from 'axios'
import {persistor, State} from "../redux/rootStore";
import {BaseFormApi} from "./BaseFormApi";
import {RESP_CODE_SUCCESS} from "../appConfig";

export const FORM_GET = 'FORM_GET'
export const FORM_GET_SUCCESS = 'FORM_GET_SUCCESS'
export const FORM_GET_FAILED = 'FORM_GET_FAILED'
export const FORM_SUBMIT = 'FORM_SUBMIT'
export const FORM_SUBMIT_FAILED = 'FORM_SUBMIT_FAILED'
export const FORM_SUBMIT_SUCCESS = 'FORM_SUBMIT_SUCCESS'
export const FORM_SUBMIT_RESPONSE = 'FORM_SUBMIT_RESPONSE'
export const FORM_RESET = 'FORM_RESET'
export const FORM_AUTH_FAILED = 'FORM_AUTH_FAILED'
export const FORM_RESPCODE_EMPTY = 'FORM_RESPCODE_EMPTY'

export interface DispatchObj<GET = any, SUBMIT = any> extends Action {
    submitResult?: SUBMIT | null
    submitResultTransformed?: any
    getResult?: GET | null
    getResultTransformed?: any
}

class FormError {
    constructor(public type: any, public response: any) {
    }
}

type Transform<DATA = any, TRANSFORMED = any> = (data: DATA) => TRANSFORMED

type Dispatch<A> = (param: A | any) => any // TODO: Investigate why I can't drop the 'any' here

interface Options {
    service: BaseFormApi
    namespace: string
    enableGlobalError?: boolean
    enableAuthError?: boolean
    submitTransform?: Transform
    submitHook?: ((data: any) => any)
    submitResultTransform?: Transform
    getResultTransform?: Transform
}

export class FormActionsCreator<GET_RESPONSE = any,
    GET_PAYLOAD = any,
    SUBMIT_PAYLOAD = any,
    SUBMIT_RESPONSE = any,
    D extends DispatchObj = DispatchObj> {
    private namespace = ''
    private service = new BaseFormApi()
    private enableGlobalError = false
    private enableAuthError = false

    constructor(options: Options) {
        Object.assign(this, options)
    }

    submitTransform = (data: any) => data
    submitHook = (data: any) => data
    submitResultTransform = (data: any) => data
    getResultTransform = (data: any) => data

    getNamespacedType = (type: string) => {
        return utilGetNamespacedType(this.namespace, type)
    }

    getDataRespCode = (result: any) => {
        return _.get(result, 'data.response.RespCode', null)
    }

    getRespCode = (result: any) => {
        return _.get(result, 'response.RespCode', null)
    }

    checkForErrors = (result: any) => {
        if (this.getDataRespCode(result) !== null) {
            if (result.data.response.RespCode !== RESP_CODE_SUCCESS) {
                throw new FormError(FORM_SUBMIT_FAILED, result)
            }
        }
        if (this.getRespCode(result) !== null) {
            if (result.response.RespCode !== RESP_CODE_SUCCESS) {
                throw new FormError(FORM_SUBMIT_FAILED, {
                    data: result
                })
            }
        }
        if (
            this.getDataRespCode(result) === null &&
            this.getRespCode(result) === null
        ) {
            if (result.data !== undefined) {
                throw new FormError(FORM_RESPCODE_EMPTY, result)
            } else {
                throw new FormError(FORM_RESPCODE_EMPTY, {
                    data: result
                })
            }
        }
    }

    get = (data?: GET_PAYLOAD): Promise<GET_RESPONSE> | any => async (
        dispatch: Dispatch<D>,
        getState: State
    ) => {
        dispatch({type: this.getNamespacedType(FORM_GET)})
        try {
            const getResult = await this.service.get(data, getState)
            this.checkForErrors(getResult)
            dispatch({
                type: this.getNamespacedType(FORM_GET_SUCCESS),
                getResult,
                getResultTransformed: this.getResultTransform(getResult)
            })
            return getResult as GET_RESPONSE
        } catch (e) {
            dispatch({type: this.getNamespacedType(FORM_GET_FAILED)})
            this.sendErrorDispatch(dispatch, e)
            throw e
        }
    };

    submit = (data: SUBMIT_PAYLOAD): Promise<SUBMIT_RESPONSE> | any => async (
        dispatch: Dispatch<D>,
        getState: State
    ) => {
        dispatch({type: this.getNamespacedType(FORM_SUBMIT)})
        let submitResult = null
        try {
            submitResult = await this.service.submit(
                this.submitTransform(data),
                getState
            )
            this.submitHook(submitResult)
            this.checkForErrors(submitResult)
            dispatch({
                type: this.getNamespacedType(FORM_SUBMIT_SUCCESS),
                submitResult,
                submitResultTransformed: this.submitResultTransform(submitResult)
            })
            return submitResult as SUBMIT_RESPONSE
        } catch (e) {
            const err = e as AxiosError
            dispatch({type: this.getNamespacedType(FORM_SUBMIT_FAILED)})
            this.sendErrorDispatch(dispatch, e)

            throw e
        }
    }

    sendErrorDispatch = (dispatch: any, e: AxiosError & { type: any }) => {
        if (e.type === FORM_AUTH_FAILED) {
            dispatch({type: FORM_AUTH_FAILED})
        }
        if (e.type === FORM_RESPCODE_EMPTY) {
            dispatch({type: this.getNamespacedType(FORM_RESPCODE_EMPTY)})
        }

        if (this.enableAuthError || this.enableGlobalError) {
            if (e.response !== undefined && e.response.status >= 400 || e.type === FORM_RESPCODE_EMPTY) {
                this.clearUser(dispatch)
                return
            }
        }

        if (this.enableGlobalError) {
            const backendMessage = _.get(e, 'response.data.response.RespDesc', null)
            if (backendMessage) {
                // showErrorMessage(backendMessage)(dispatch)
                return
            }
            // showErrorMessage(ERROR)(dispatch)
            return
        }
    }

    reset = () => async (dispatch: Dispatch<D>) => {
        return dispatch({type: this.getNamespacedType(FORM_RESET)})
    }

    clearUser = (dispatch: any) => {
        persistor.flush()
        dispatch({type: 'REMOVE_CREDENTIALS'})
        // no need to alert error, just sign them out will do
        console.log('User not authorised.')
    }
}

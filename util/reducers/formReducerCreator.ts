import {
  DispatchObj,
  FORM_GET,
  FORM_GET_SUCCESS,
  FORM_GET_FAILED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCESS,
  FORM_RESET
} from '../actions/FormActionsCreator'
import { getNamespacedType } from '../reduxTools'

export interface FormStatus {
  isSubmitting: boolean
  isSubmitSuccess: boolean | null
  isGetting: boolean
  isGetSuccess: boolean | null
}

export interface FormState<GET = any, SUBMIT = any>
  extends Partial<DispatchObj<GET, SUBMIT>>,
    FormStatus {}

const initialFormStatus: FormStatus = {
  isSubmitting: false,
  isSubmitSuccess: null,
  isGetting: false,
  isGetSuccess: null
}

const initialState: FormState = {
  ...initialFormStatus,
  submitResult: null,
  submitResultTransformed: null,
  getResult: null,
  getResultTransformed: null
}

export const formReducerCreator = <GET = any, SUBMIT = any>(
  namespace: string,
  nextDispatcher?: (state: any, action: any) => FormState<GET, SUBMIT>
) => (
  state: FormState<GET, SUBMIT> = initialState,
  action: any
): FormState<GET, SUBMIT> => {
  const getType = (type: any) => getNamespacedType(namespace, type)
  switch (action.type) {
    case getType(FORM_GET):
      return {
        ...state,
        isGetting: true
      }
    case getType(FORM_GET_SUCCESS):
      return {
        ...state,
        getResult: action.getResult,
        getResultTransformed: action.getResultTransformed,
        isGetSuccess: true,
        isGetting: false
      }
    case getType(FORM_GET_FAILED):
      return {
        ...state,
        isGetSuccess: false,
        isGetting: false
      }
    case getType(FORM_SUBMIT):
      return {
        ...state,
        isSubmitting: true
      }
    case getType(FORM_SUBMIT_FAILED):
      return {
        ...state,
        isSubmitting: false,
        isSubmitSuccess: false
      }
    case getType(FORM_SUBMIT_SUCCESS):
      return {
        ...state,
        isSubmitting: false,
        submitResult: action.submitResult,
        submitResultTransformed: action.submitResultTransformed,
        isSubmitSuccess: true
      }
    case getType(FORM_RESET):
      return {
        ...state,
        ...initialFormStatus
      }
    default:
      if (nextDispatcher) {
        return nextDispatcher(state, action)
      }
      return state
  }
}

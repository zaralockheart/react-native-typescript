import {ajax} from '../../util/api/Ajax'
import {FormActionsCreator} from '../../util/actions/FormActionsCreator'
import {formReducerCreator} from '../../util/reducers/formReducerCreator'
import {BaseFormApi} from "../../util/actions/BaseFormApi";
import {State} from "../../util/redux/rootStore";
import {header} from "../../util/api/header";
import * as _ from 'lodash'

export const ACTIVITY_NAMESPACE = `ACTIVITY`

interface ActivityItem {

}

export interface ActivityGet {
    someParam: string
}

export interface ActivitySubmit {
    someParam: string
}

class ActivityApi extends BaseFormApi {
    get = async (data: ActivityGet, state: State) => {
        try {
            const option = header({key: state.signIn.authKey})
            return await ajax.get("END_POINT_ACTIVITY_GET", option)
        } catch (err) {
            console.log('ActivityApi error:', err)
            throw err
        }
    };

    submit = async (data: ActivitySubmit, state: State) => {
        try {
            const option = header({key: state.signIn.authKey})
            const payload: ActivitySubmit = {
                someParam: "value"
            }

            return await ajax.post(
                "END_POINT_REQUEST_EMAIL_CODE_SUBMIT",
                payload,
                option
            )
        } catch (err) {
            throw err
        }
    }
}

const api = new ActivityApi()

const actions = new FormActionsCreator({
    service: api,
    namespace: ACTIVITY_NAMESPACE
})

export const ActivityGet = actions.get

export const requestEmailCodeSubmit = actions.submit

export const activityReducer = formReducerCreator(ACTIVITY_NAMESPACE)

export const ActivitySelector = (state: State) => {
    return _.get(
        state,
        'formStatus.activity.getResult.data.Activities',
        []
    ) as ActivityItem[] // same as null.data and this gives an error
}


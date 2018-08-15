1. Normal import stuff
    ```
    import {ajax} from '../../util/api/Ajax'
    import {FormActionsCreator} from '../../util/actions/FormActionsCreator'
    import {formReducerCreator} from '../../util/reducers/formReducerCreator'
    import {BaseFormApi} from "../../util/actions/BaseFormApi";
    import {State} from "../../util/redux/rootStore";
    import {header} from "../../util/api/header";
    import * as _ from 'lodash'
    ```

2. create a namespace for the api
    ```
    export const API_TEST_NAMESPACE = `API_TEST`
    ```

3. Create an interface from response JSON
    ```
    interface ActivityItem {
    
    }
    ```

4. Create an interface for Get or Submit
    ```
    export interface ActivityGet {
        someParam: string
    }
    
    export interface ActivitySubmit {
        someParam: string
    }
    ```

5. Create a class for the api, only use one, either get / submit and remove the other
    ```
    class ActivityApi extends BaseFormApi {
        get = async (data: ActivityGet, state: State) => {
            try {
                const option = header({key: state.signIn.authKey})
                return await ajax.get("END_POINT_API_TEST_GET", option)
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
        namespace: API_TEST_NAMESPACE
    })
    
    export const ActivityGet = actions.get
    
    export const requestEmailCodeSubmit = actions.submit
    
    export const activityReducer = formReducerCreator(API_TEST_NAMESPACE)
    ```

6. Don't forget to import reducer to `rootStore.ts`

7. Create our selector for getting the value back
    ```
    
    export const ActivitySelector = (state: State) => {
        return _.get(
            state,
            'formStatus.activity.getResult.data.Activities',
            []
        ) as ActivityItem[] // same as null.data and this gives an error
    }
    
    ```
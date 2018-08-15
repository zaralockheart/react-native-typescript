// Redux file, this is where you wanna store the datas into redux.

import {Dispatch} from "redux";
import {State} from "../../util/redux/rootStore";

export const STORE_AUTH_KEY = 'STORE_AUTH_KEY'

export interface SignInAction extends Redux{
    authKey: string
}

const initialState = {
    authKey: '',
}

/**
 *
 * @param data is what you wanna save into
 * import this to mapDispatchToProps where you need it
 */
export const saveAuthKeyDispatcher = (data: SignInAction) => (dispatch: Dispatch) => {
    dispatch({
        type: STORE_AUTH_KEY,
        authKey: data.authKey
    })
}

// import this to rootStore.ts
export const signInDetailsReducer = (state = initialState, action: SignInAction) => {
    switch (action.type) {
        // make sure this is same from type above
        case STORE_AUTH_KEY:
            return {
                // this is copying from previous state
                ...state,
                // this is to override previous newUserDetails state
                authKey: action.authKey,
            }
        default:
            return state
    }
}


/**
 *
 * @param state taken from rootStore.ts
 * This is our selector, import it to mapStateToProps where you need it
 */
export const signInDetailsSelector = (state: State) => {
    return {
        authKey: state.signIn.authKey
    }
}
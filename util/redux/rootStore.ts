import {applyMiddleware, combineReducers, createStore, Store} from "redux";
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from "redux-persist";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import {SignInAction, signInDetailsReducer} from "../../src/splash/signInRedux";
import {FormState} from "../reducers/formReducerCreator";
import {activityReducer} from "../../src/splash/signInApi";

interface ReducersAugment {
    signIn: SignInAction
    formStatus: {
        activity: FormState
    }
}

const appReducers = combineReducers({
    signIn: combineReducers({
        signInDetailsReducer
    }),
    formStatus: combineReducers({
        activity: activityReducer
    })
})

const config = {
    key: 'root',
    storage,
    whitelist: [
        '_persist',
        'scannerRoute',
        'signInAuthentication',
        'persistentSettings',
        'primeIdNew',
        'deviceSettings'
    ]
}

const persistedReducer = persistReducer(config, appReducers)

const rootReducer = (state: State, action: any) => {
    // if (action.type === REMOVE_CREDENTIALS) {
    //     // tslint:disable-next-line
    //     const {
    //         _persist,
    //         deviceSettings,
    //         backgroundService: { errorMessage, isErrorMessageVisible }
    //     } = state as any
    //     return (persistedReducer as any)(
    //         {
    //             _persist,
    //             deviceSettings,
    //             backgroundService: { errorMessage, isErrorMessageVisible }
    //         },
    //         action
    //     )
    // }
    return (persistedReducer as any)(state, action)
}

export type State = ReducersAugment

const store: Store<State> = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
)

const persistor = persistStore(store)

export { store }
export { persistor }
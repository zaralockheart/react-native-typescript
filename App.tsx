/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {PortalProvider} from "react-native-portal";
import {Provider} from "react-redux";
import {persistor, store} from "./util/redux/rootStore";
import {PersistGate} from "redux-persist/integration/react";
import {Routes} from "./util/routes/Routes";
import {BackgroundService} from "./util/routes/BackgroundService";

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <PortalProvider>
                <Provider store={store}>
                    <PersistGate
                        loading={null}
                        onBeforeLift={() => {
                        }}
                        persistor={persistor}>
                        <Routes {...this.props}/>
                        {/*<BackgroundService />*/}
                    </PersistGate>
                    <BackgroundService/>
                </Provider>
            </PortalProvider>
        );
    }
}
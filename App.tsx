/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {PortalProvider, WhitePortal} from "react-native-portal";
import {Provider} from "react-redux";
import {persistor, store} from "./util/redux/rootStore";
import {PersistGate} from "redux-persist/integration/react";
import {Routes} from "./util/routes/Routes";
import {BackgroundService} from "./util/routes/BackgroundService";
import {Fragment} from "./src/components/Fragment";
import {View} from "react-native";

type Props = {};

class AppBase extends Component<Props> {
    render() {
        return (
            <PortalProvider>
                <Provider store={store}>
                    <PersistGate
                        onBeforeLift={() => null}
                        persistor={persistor}
                        loading={
                            <View style={{ flex: 1, backgroundColor: 'white' }} />
                        }
                    >
                        <Fragment>
                            <Routes {...this.props} />
                            <BackgroundService {...this.props} />
                        </Fragment>
                    </PersistGate>
                </Provider>
                {/*<WhitePortal name={'default'} />*/}
            </PortalProvider>
        );
    }
}

export const App = AppBase as React.ComponentClass<Props>
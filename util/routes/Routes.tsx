import {State} from "../redux/rootStore";
import {returnType} from "../typeTools";
import * as React from "react";
import {connect} from "react-redux";
import {ENV, FIRST_SCREEN as DevFirstScreen} from "../../settings/ReactNative";
import {ENV_DEVELOPMENT} from "../../settings/environment";
import * as RouteKeys from "../routes/routeKeys";
import {BackHandler, StatusBar, View, StyleSheet} from "react-native";
import {Actions, Drawer, Router, Scene, Stack} from "react-native-router-flux";
import {Splash} from "../../src/splash/Splash";

interface RoutesBaseProps {
}

const mapStateToProps = (state: State) => {
    return {}
}

const mapDispatchToProps = {
}

const mapStateToPropsTypeMaker = returnType(mapStateToProps)
type ReduxStates = typeof mapStateToPropsTypeMaker

type Props = RoutesBaseProps & ReduxStates & typeof mapDispatchToProps

export class RoutesBase extends React.Component<Props> {

    onBackPress = () => {
        console.log('current scene :', Actions.currentScene)
        // don't put console.log on the Actions object. Your app will crash!
        if (
            Actions.currentScene === RouteKeys.SPLASH
        ) {
            BackHandler.exitApp()
            return false
        }
        Actions.pop()
        return true
    }

    render() {
        let FIRST_SCREEN = RouteKeys.SPLASH

        if (ENV === ENV_DEVELOPMENT) {
            FIRST_SCREEN = DevFirstScreen
        }
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    backgroundColor={'white'}
                    barStyle="light-content"
                />

                <Router backAndroidHandler={this.onBackPress}>
                    <Stack>
                        <Scene initial={FIRST_SCREEN === RouteKeys.SPLASH}
                               key={RouteKeys.SPLASH}
                               component={Splash}
                               hideNavBar
                               panHandlers={null}/>
                    </Stack>
                    {/*<Drawer*/}
                        {/*drawerWidth={212}*/}
                        {/*initial={FIRST_SCREEN === RouteKeys.HOME}*/}
                        {/*// onEnter={() => googleTracker.trackScreenView(RouteKeys.HOME)}*/}
                        {/*key={RouteKeys.HOME}*/}
                        {/*contentComponent={DrawerContent}*/}
                        {/*gesturesEnabled={false}*/}
                        {/*hideNavBar*/}
                    {/*>*/}
                        {/*<Scene*/}
                            {/*key={RouteKeys.RNRF_FIX}*/}
                            {/*component={() => null}*/}
                            {/*hideNavBar*/}
                            {/*panHandlers={null}*/}
                        {/*/>*/}
                        {/*<Scene*/}
                            {/*initial*/}
                            {/*key={RouteKeys.HOME_VIEW}*/}
                            {/*onEnter={() => {*/}
                                {/*// googleTracker.trackScreenView(RouteKeys.HOME)*/}
                                {/*Keyboard.dismiss()*/}
                            {/*}}*/}
                            {/*component={Home}*/}
                            {/*hideNavBar*/}
                            {/*panHandlers={null}*/}
                        {/*/>*/}
                    {/*</Drawer>*/}
                </Router>
               </View>
        )
    }
}

export const Routes = (connect(mapStateToProps, mapDispatchToProps)(
    RoutesBase as any
) as any) as React.ComponentClass<Props>

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },

})
import * as React from 'react'
import {Keyboard, Platform, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {returnType} from "../../util/typeTools";
import {State} from "../../util/redux/rootStore";
import {saveAuthKeyDispatcher, signInDetailsSelector} from "./signInRedux";

const mapStateToProps = (state: State) => {
    return {
        ...signInDetailsSelector(state)
    }
}

const mapDispatchToProps = {
    saveAuthKeyDispatcher
}

const MapStateToProps = returnType(mapStateToProps)

type MapStateToPropsT = typeof MapStateToProps

type Props = MapStateToPropsT & typeof mapDispatchToProps

class SplashBase extends React.Component<Props> {
    componentDidMount() {
        Keyboard.dismiss()

        this.props.saveAuthKeyDispatcher({
            authKey: 'this is where the value is stored'
        })

        console.log(this.props.authKey)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        )
    }
}

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export const Splash = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(SplashBase)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    updateText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666666',
        backgroundColor: 'transparent'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

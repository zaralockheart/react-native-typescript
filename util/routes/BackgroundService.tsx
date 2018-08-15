import {returnType} from "../typeTools";
import * as React from "react";
import {State} from "../redux/rootStore";
import {Fragment} from "../../src/components/Fragment";
import {connect} from "react-redux";

/**
 *  Helper class for Anything that is repeatable, eg. Alert Dialog
 */

export interface ExposedBackgroundServiceProps {
}

const mapStateToProps = (state: State) => {
    return {
    }
}

const mapDispatchToProps = {
}

const mapStateToPropsTypeMaker = returnType(mapStateToProps)
type ReduxStates = typeof mapStateToPropsTypeMaker

type Props = ExposedBackgroundServiceProps &
    typeof mapDispatchToProps &
    ReduxStates

class BackgroundServiceBase extends React.Component<Props> {
    render() {
        return (
            <Fragment>
            </Fragment>
        )
    }
}

export const BackgroundService = (connect(mapStateToProps, mapDispatchToProps)(
    BackgroundServiceBase as any
) as any) as React.ComponentClass<ExposedBackgroundServiceProps>
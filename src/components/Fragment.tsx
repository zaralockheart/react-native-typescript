import * as React from "react";

export class Fragment extends React.Component {
    render() {
        return this.props.children || (null as any)
    }
}
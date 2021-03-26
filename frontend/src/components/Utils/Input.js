import React from "react";

export default class Input extends React.Component {
    render() {
        return (
            <input value={this.props.value} className={this.props.className}/>
        )
    }
}
import React from "react";
import PropTypes from "prop-types";

export default class InputRpg extends React.Component {
    input_type(){
        switch (this.props.type){
            case "int":
                return (<input type={'number'} value={this.props.value} onChange={this.onChange()}/>)
            case "text":
                return (<input type={'text'} value={this.props.value} onChange={this.onChange()}/>)
            default:
                return ""
        }
    }

    onChange(){
        const _this = this
        return (e) => {
            console.log(_this.props)
            const {value} = e.target

            if (_this.props.onChange != null){
                _this.props.onChange(_this.props.reference, value)
            }
        }
    }

    render() {
        return this.input_type()
    }
}

InputRpg.protoTypes = {
    type: PropTypes.oneOf(['int', 'text']).isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    reference: PropTypes.string.isRequired
}
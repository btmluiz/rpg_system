import React from "react";
import PropTypes from "prop-types";

export default class InputRpg extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
    }

    input_type(){
        switch (this.props.type){
            case "int":
                return (<input type={'number'} value={this.props.value} onChange={this.onChange}/>)
            case "text":
                return (<input type={'text'} value={this.props.value} onChange={this.onChange}/>)
            default:
                return ""
        }
    }

    onChange(e){
        const {value} = e.target

        if (this.props.onChange != null){
            this.props.onChange(this.props.reference, value)
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
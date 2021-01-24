import "./Room.css";
import React from "react";
import {withRouter} from "react-router";
import backend_url from "../../configs";
import render_template from "../../utils/Utils";
import RenderTemplate from "../../utils/Utils";

class Room extends React.Component {

    constructor(props) {
        super(props);
        const {id} = this.props.match.params.id
        this.get_room(id)
    }

    get_room(id) {
        // fetch(`${backend_url}/room/?id=1/`)
    }

    render() {
        return (
            <div>
                <RenderTemplate/>
            </div>
        )
    }
}

export default withRouter(Room)
import "./Room.css";
import React from "react";
import {withRouter} from "react-router";
import backend_url from "../../configs";
import RenderTemplate from "../RenderTemplate/RenderTemplate";
import RoomManager from "../../managers/RoomManager";

class Room extends React.Component {

    constructor(props) {
        super(props);
        const {id} = this.props.match.params
        this.state = {
            pk: id,
            details: {},
            master: {},
            player: {},
            template: [],
            css: {},
            render: "",
            manager: new RoomManager(this, id)
        }
    }

    componentWillMount() {
        this.get_room(this.state.pk)
    }

    get_room(id) {
        if (id !== undefined) {
        }
        fetch(`${backend_url}/room/${id}/`, {
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then((res) => {
                this.setState({
                    template: res.template,
                    css: res.css
                })
            })
    }

    render() {
        return (
            <div>
                <RenderTemplate player_info={this.state.player} objects={this.state.objects}
                                template={this.state.template} css={this.state.css} details={this.state.details}
                                manager={this.state.manager}/>
            </div>
        )
    }
}

export default withRouter(Room)
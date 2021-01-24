import React from "react";
import backend_url from "../../configs";
import {BrowserRouter, Link, Route} from "react-router-dom";
import Room from "../../components/Room/Room";


export default class HomePage extends React.Component {

    state = {
        rooms: []
    }

    componentDidMount() {
        this.get_rooms()
    }

    get_rooms() {
        fetch(`${backend_url}/get_rooms/`, {
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    rooms: json['rooms']
                })
            })
    }

    render() {
        const {rooms} = this.state
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Route exact path={'/home'}>
                        <div>
                            <ul>
                                {rooms.map(room => {
                                    const {id, name} = room
                                    return (
                                        <li key={id}>
                                            <Link to={`/home/${id}`}>{name}</Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </Route>
                    <Route path={`/home/:id`} children={<Room/>}/>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
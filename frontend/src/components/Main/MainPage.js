import React from "react";
import "./MainPage.css";
import {Link} from "react-router-dom";

export default class MainPage extends React.Component {
    render() {
        return (
            <div className={'main-frame'}>
                <div className={'menu'}>
                    <ul className={'m-0-auto ul-list-inline-block ul-list-no-decoration'}>
                        <li><Link to={'/'}>Inicio</Link></li>
                        <li><Link to={'/login'}>Login</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}
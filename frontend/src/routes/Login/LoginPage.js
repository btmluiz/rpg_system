import React from "react";
import {LoginForm} from "../../components/Login/LoginForm";
import { Redirect } from "react-router-dom"
import PropTypes from "prop-types";

class LoginPage extends React.Component {
    render() {
        return(
            <React.Fragment>
                <LoginForm handle_login={this.props.handle_login}/>
            </React.Fragment>
        )
    }
}

export default LoginPage;

LoginPage.propTypes = {
    handle_login: PropTypes.func.isRequired,
}
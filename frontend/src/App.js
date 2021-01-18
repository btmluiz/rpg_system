import './App.css';
import React from "react";
import {LoginFrom} from "./components/Login/LoginFrom";
import SignupForm from "./components/Signup/SignupForm";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayed_form: '',
            logged_in: !!localStorage.getItem('token'),
            username: ''
        }
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch('http://localhost:8000/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({username: json.username})
                })
        }
    }

    handle_login = (e, data) => {
        e.preventDefault()
        fetch('http://localhost:8000/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token)
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.user.username
                })
            })
    }

    handle_signup = (e, data) => {
        e.preventDefault()
        fetch('http://localhost:8000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token)
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.user.username
                })
            })
    }

    handle_logout = () => {
        localStorage.removeItem('token')
        this.setState({logged_in: false, username: ''})
    }

    display_form = form => {
        this.setState({
            displayed_form: form
        })
    }

    render() {
        let form
        switch (this.state.displayed_form) {
            case "login":
                form = <LoginFrom handle_login={this.handle_login} submit_form={() => {this.setState({displayed_form: 'signup'})}}/>
                break;
            case "signup":
                form = <SignupForm />
                break;
            default:
                form = null
        }

        return (
            <React.Fragment>
                {form}
                {this.state.logged_in
                    ? `Hello, ${this.state.username}`
                    : 'Please Log In'}
            </React.Fragment>
        )
    }

}

export default App;

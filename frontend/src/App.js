import './App.css';
import React from "react";
import {Switch, Route, BrowserRouter, Redirect} from "react-router-dom";
import LoginPage from "./routes/Login/LoginPage";
import backend_url from "./configs";
import HomePage from "./routes/Home/HomePage";
import MainPage from "./components/Main/MainPage";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logged_in: !!localStorage.getItem('token'),
            username: '',
            rooms: []
        }
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch(backend_url + '/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    console.log(res)
                    let status = res.status
                    let json = res.json()

                    if (status === 200)
                        this.setState({
                            username: json.username,
                            logged_in: true
                        })
                    else
                        this.setState({
                            username: '',
                            logged_in: false
                        })
                })
        }
    }

    handle_login = (e, data) => {
        e.preventDefault()
        fetch(backend_url + '/login/', {
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
                    username: json.user.username
                })
            })
    }

    handle_signup = (e, data) => {
        e.preventDefault()
        fetch(backend_url + '/users/', {
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
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route path={'/login'}>
                            <LoginPage handle_login={this.handle_login}/>
                            {this.state.logged_in ? <Redirect to={'/home'}/> : null}
                        </Route>
                        <Route path={'/signup'}>
                            Cadastro
                            {this.state.logged_in ? <Redirect to={'/Home'}/> : null}
                        </Route>
                        <Route path={'/home'}>
                            <HomePage/>
                            {!this.state.logged_in ? <Redirect to={'/login'}/> : null}
                        </Route>
                        <Route path={'/'}>
                            <MainPage/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        )
    }

}

export default App;

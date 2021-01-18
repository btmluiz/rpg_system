import "./LoginForm.css";
import React from "react";
import PropTypes from 'prop-types';

export class LoginFrom extends React.Component {
    state = {
        username: '',
        password: ''
    }

    handle_change = e => {
        const name = e.target.name
        const value = e.target.value

        this.setState(prevState => {
            const newState = {...prevState}
            newState[name] = value
            return newState
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className={'auth-box'}>
                    <form onSubmit={e => this.props.handle_login(e, this.state)}>
                        <div className={'group'}>
                            <input type={'text'}
                                   placeholder={'Usuário'}
                                   name={'username'}
                                   value={this.state.username}
                                   onChange={this.handle_change}
                            />
                            <input type={'password'}
                                   placeholder={'Senha'}
                                   name={'password'}
                                   value={this.state.password}
                                   onChange={this.handle_change}
                            />
                            <div className={'flex'}>
                                <div className={'text-left w-100'}>
                                    <label onClick={this.props.submit_form}>Registre-se</label>
                                </div>
                                <div className={'text-right w-100'}>
                                    <label>Lembre-se de mim</label><input type={'checkbox'}/>
                                </div>
                            </div>
                        </div>
                        <button>Entrar</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

LoginFrom.propTypes = {
    handle_login: PropTypes.func.isRequired,
    submit_form: PropTypes.func.isRequired
}

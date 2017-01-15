import React from 'react';
import Promise from 'promise-polyfill'; 
if (!window.Promise) {window.Promise = Promise;}
import 'whatwg-fetch';

import UrlConst 		from '../const/UrlConst';
import { AuthAlerts } 	from '../const/Alerts';

export default class AuthForm extends React.Component{
	
	constructor(){ super();
		this.state = { 
			authAlert: null
		};
	}


	validateAuthForm(login, pass){
		if( !(login && pass) ) {
			this.setState({authAlert: AuthAlerts.empty});
			return true;
		}
		if( /\s/.test(login) || /\s/.test(pass) ) {
			this.setState({authAlert: AuthAlerts.whitespace});
			return true;
		}
		if( (login.length < 3) || (pass.length < 3) ) {
			this.setState({authAlert: AuthAlerts.lengthError});
			return true;
		}

		return false;
	}

	requestLogReg(url, username, password){
		return fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ username, password })
		})
		.then(response => response.json())
		.then(json => json)
		.catch(ex => console.log(ex));
	}

	authorize(event, url, username, password){
		event.preventDefault();
		if( this.validateAuthForm(username, password) ) return null;

		this.requestLogReg(url, username, password)
			.then(data => {
				if(!data.success){
					this.setState({
						authAlert: AuthAlerts.serverError(data.message)
					});
					console.log(data.message);
					return null;
				}

				this.setState({ logName: username });

				this.props.setToken(data.token);
				this.props.setLogged(true);
			});
	}


	render(){
		let authform = (
			<form className="col-md-4 mx-auto">
				{ (this.state.authAlert && !this.props.logged) ? this.state.authAlert : null }

				<div className="form-group">
					<input type="text" className="form-control" required 
						ref={input => this.authName = input} 
					/>
					<input type="password" className="form-control" required 
						ref={input => this.authPass = input} 
					/>
				</div>
				<button className="btn btn-primary"
					onClick={e => this.authorize(e, UrlConst.log, this.authName.value, this.authPass.value)}
				>Login</button>
				<button className="btn btn-secondary"
					onClick={e => this.authorize(e, UrlConst.reg, this.authName.value, this.authPass.value)}
				>Reg</button>
			</form>
		);
		let logged = (
			<div>
				Logged as <strong>{this.state.logName}</strong>
			</div>
		);

		let pattern = (
			<div className="my-4">
				{ this.props.logged ? logged : authform }
			</div>
		);

		return this.props.hide ? null : pattern;
	}
};
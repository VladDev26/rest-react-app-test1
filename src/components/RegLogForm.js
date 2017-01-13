import React from 'react';

export const RegLogForm = props => {
	let authform = (
		<form className="col-md-4 mx-auto">
			{ props.authAlert && !props.logged ? props.authAlert : null }
			<div className="form-group">
				<input type="text" className="form-control" required 
					onChange={e => props.setLogin(e)} />
				<input type="password" className="form-control" required 
					onChange={e => props.setPass(e)} />
			</div>
			<button onClick={e => props.submitLogin(e)} className="btn btn-primary">Login</button>
			<button onClick={e => props.submitReg(e)} className="btn btn-secondary">Reg</button>
		</form>
	);
	let logged = (
		<div>
			Logged as <strong>{props.logName}</strong>
		</div>
	);

	let pattern = (
		<div className="my-4">
			{ props.logged ? logged : authform }
		</div>
	);

	return props.hide ? null : pattern;
};
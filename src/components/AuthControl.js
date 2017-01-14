import React from 'react';

export const AuthControl = props => {
	let pattern = (
		<div className="row px-3 mb-4">
			<div className="d-inline-block ml-auto">
				<button onClick={ props.showAuthForm } className="btn btn-primary">Login</button>
				<button onClick={ props.showAuthForm } className="btn btn-info">Sign up</button>
			</div>
		</div>
	);
	
	return props.hide ? null : pattern;
};
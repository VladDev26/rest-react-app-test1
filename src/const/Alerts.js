import React from 'react';

export const ReviewAlerts = {
	success: (
		<div className="alert alert-success">
		  Review was successfully added!
		</div>
	),
	empty: (
		<div className="alert alert-danger">
		  Please fill the text field.
		</div>
	)
};



export const AuthAlerts = {
	whitespace: (
		<div className="alert alert-danger">
			<strong>Error! </strong>
		  	Please remove whitespaces.
		</div>
	),
	empty: (
		<div className="alert alert-danger">
			<strong>Error! </strong>
		  	Please fill all fields.
		</div>
	),
	lengthError: (
		<div className="alert alert-danger">
			<strong>Error! </strong>
			Length must be at least 3 characters.
		</div>
	),
	serverError: msg => {
		return(
			<div className="alert alert-danger">
				<strong>Error! </strong>
				{msg}
			</div>
		);
	}
};
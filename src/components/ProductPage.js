import React from 'react';

export const ProductPage = props => {
	// console.log(props);
	let product = props.product ? (
		<div className="col">
			<h2>{props.product.title}</h2>
			<img className="img-fluid rounded my-4" 
				src={'http://smktesting.herokuapp.com/static/' + props.product.img} alt=""/>
			<h3>Description</h3>
			<p className="card-text">{props.product.text}</p>
		</div>
	) : null;

	let pattern = (
		<div className="row">
			{product}
			{props.children}
		</div>
	);

	return props.hide ? null : pattern;
};
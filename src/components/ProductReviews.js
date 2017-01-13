import React from 'react';

export const ProductReviews = props => {
	// console.log(props.product.id);
	let review = props.reviews.map(item => {
		return(
			<li className="list-group-item justify-content-between" key={item.id}>
				<div className="d-flex w-100 justify-content-between">
			    	<h5 className="mb-1">{item.created_by.username}</h5>
			    	<small className="text-muted">{item.created_at}</small>
			    </div>
				{item.text}
				<span className="badge badge-success badge-pill">{item.rate}</span>
			</li>
		);
	});




	let addReview = props.logged ? (
		<div className="mb-4">
			<textarea 
				value={props.reviewText}
				onChange={e => props.setText(e.target.value)} className="form-control" rows="3"></textarea>
			<select 
				value={props.reviewRate}
				onChange={e => props.setRate(e.target.value)} className="form-control col-sm-6">
				<option>1</option>
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
			</select>
			<button onClick={() => props.addReview(props.product.id)} className="btn btn-info">Send review</button>
		</div>
	) : (
		<div className="alert alert-info">
			Please&nbsp;
			<span onClick={() => props.showAuthForm()} className="alert__link">
				login
			</span>
			&nbsp;to add a review.
		</div>
	);




	let pattern = (
		<div className="col">
			{props.reviewAlert ? props.reviewAlert : null}
			{addReview}
			<h3 className="my-3">Reviews</h3>
			<ul className="list-group" style={{color: '#2a2b32'}}>
				{review}
			</ul>
		</div>
	);
	
	return props.hide ? null : pattern;
};
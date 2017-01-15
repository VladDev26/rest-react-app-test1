import React from 'react';

const Review = props => {
	let elem = props.reviews.map( item => {
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

	return(
		<ul className="list-group" style={{color: '#2a2b32'}}>
			{elem}
		</ul>
	);
};

export default Review;
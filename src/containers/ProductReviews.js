import React from 'react';
import Promise from 'promise-polyfill'; 
if (!window.Promise) {window.Promise = Promise;}
import 'whatwg-fetch';


import UrlConst 					from '../const/UrlConst';
import { ReviewAlerts, AuthAlerts } from '../const/Alerts';

import Review 						from '../components/Review';

export default class ProductReviews extends React.Component{
	
	constructor(){ super();
		this.state = { reviewAlert: null };
	}

	clearReviewForm(){
		this.reviewText.value = '';
		this.reviewRate.value = 1;
	}

	setAlert(reviewAlert){
		return this.setState({ reviewAlert });
	}

	addReview(id, rate, text){
		if(text == '') {
			this.setAlert( ReviewAlerts.empty );
			return null;
		}

		return fetch( UrlConst.reviews + id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Token ' + this.props.token
				},
				body: JSON.stringify({ rate, text })
			})
			.then( response => response.json())
			.then( json => {
				this.setAlert( ReviewAlerts.success );
				this.clearReviewForm();
				return json;
			})
			.catch(ex => {
				this.setAlert( AuthAlerts.serverError(ex) );
				console.log(ex);
			});
	}


	render(){
		let reviewForm = (
			<div className="mb-4">
				<textarea className="form-control" rows="3"
					ref={input => this.reviewText = input}
				></textarea>

				<select className="form-control col-sm-6"
					ref={input => this.reviewRate = input}
				>
					{ [1,2,3,4,5].map( (item, i) => <option key={i}>{item}</option> ) }
				</select>

				<button className="btn btn-info"
					onClick={() => this.addReview(
						this.props.product.id,
						this.reviewRate.value,
						this.reviewText.value
					)}
				>Send review</button>
			</div>
		);
		
		let pleaseLogin = (
			<div className="alert alert-info">
				Please&nbsp;
				<span className="alert__link" 
					onClick={ this.props.showAuthForm } 
				>login</span>
				&nbsp;to add a review.
			</div>
		);

		let setReview = this.props.logged ? reviewForm : pleaseLogin;




		let pattern = (
			<div className="col">
				{this.state.reviewAlert ? this.state.reviewAlert : null}
				{setReview}
				<h3 className="my-3">Reviews</h3>
				<Review reviews={this.props.reviews} />
			</div>
		);
		
		return this.props.hide ? null : pattern;
	}
};
import React from 'react';
import Promise from 'promise-polyfill'; 
if (!window.Promise) {window.Promise = Promise;}
import 'whatwg-fetch';

import { UrlConst } 					from '../const/UrlConst';
import { AuthAlerts, ReviewAlerts } 	from '../const/Alerts';

import { ProductList } 					from '../components/ProductList';
import { ProductPage } 					from '../components/ProductPage';
import { RegLogForm } 					from '../components/RegLogForm';
import { ProductReviews } 				from '../components/ProductReviews';
import { AuthControl } 					from '../components/AuthControl';


export default class App extends React.Component{
	constructor(){ super();
		this.state = {
			products: [],
			reviews: [],

			reviewRate: 1,
			reviewText: '',

			product: null,
			productID: null,

			hideForm: true,
			hideProductList: false,
			hideProductPage: true,
			hideProductReviews: true,
			hideAuthControl: false,

			isLogged: false
		};
	}

	componentDidMount(){
		this.getAllProducts(UrlConst.products)
			.then(arr => this.setState({products: arr}));
	}

	setLogin(e){this.setState({ login: e.target.value });}
	setPass(e){this.setState({ pass: e.target.value });}

	validateForm(login, pass){
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

	getAllProducts(url){
		return fetch(url)
			.then(response => response.json())
			.then(json => json)
			.catch(ex => console.log('parsing failed', ex));
	}
	getReviewsByID(url, id){
		return fetch(url+id)
			.then(response => response.json())
			.then(json => json)
			.catch(ex => console.log('parsing failed', ex));
	}

	requestLogReg(url, login, pass){
		return fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				username: login,
				password: pass
			})
		}).then(response => response.json())
		.then(json => json)
		.catch(ex => console.log('parsing failed', ex));
	}



	setRate(reviewRate){this.setState({ reviewRate });}
	setText(reviewText){this.setState({ reviewText });}
	






	addReview(id){
		if(this.state.reviewText == '') {
			this.setState({reviewAlert: ReviewAlerts.empty});
			return;
		}

		return fetch( UrlConst.reviews + id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Token ' + this.state.token
				},
				body: JSON.stringify({
					rate: this.state.reviewRate,
					text: this.state.reviewText
				})
			})
			.then(response => response.json())
			.then(json => {
				this.setState({
					reviewRate: 1,
					reviewText: '',
					reviewAlert: ReviewAlerts.success
				});
				return json;
			})
			.catch(ex => {
				this.setState({reviewAlert: ReviewAlerts.serverError});
				console.log('parsing failed', ex)
			});
	}





	submitLogin(e){
		e.preventDefault();
		this.authorize(UrlConst.log);
	}
	submitReg(e){
		e.preventDefault();
		this.authorize(UrlConst.reg);
	}

	authorize(url){
		if( this.validateForm(this.state.login, this.state.pass) ) return null;

		this.requestLogReg(url, this.state.login, this.state.pass)
			.then(data => {
				if(!data.success){
					this.setState({authAlert: (
						<div className="alert alert-danger">
							<strong>Error! </strong>
							{data.message}
						</div>
					)});
					console.log(data.message);
					return null;
				}

				this.setState({ 
					logName: this.state.login,
					token: data.token,
					isLogged: true
				});
			});
	}
	

	showProduct(id, item){
		this.setState({
			hideProductList: true,
			hideProductPage: false,
			hideProductReviews: false,
			product: item
		});

		this.getReviewsByID(UrlConst.reviews, id)
			.then(data => {
				this.setState({reviews: data});
			});
	}

	showAuthForm(){
		this.setState({
			hideForm: false,
			hideAuthControl: true
		});
	}



	render(){
		return(
			<div className="container my-4">
				<AuthControl 
					hide={this.state.hideAuthControl} 
					showAuthForm={this.showAuthForm.bind(this)} 
				/>
				<RegLogForm 
					setLogin={this.setLogin.bind(this)}
					setPass={this.setPass.bind(this)}
					submitLogin={this.submitLogin.bind(this)}
					submitReg={this.submitReg.bind(this)}
					hide={this.state.hideForm}
					logged={this.state.isLogged}
					logName={this.state.logName}
					authAlert={this.state.authAlert}
				/>
				<ProductList 
					showProduct={this.showProduct.bind(this)} 
					hide={this.state.hideProductList} 
					products={this.state.products} 
				/>
				<ProductPage 
					hide={this.state.hideProductPage}
					products={this.state.products}
					product={this.state.product}
				>
					<ProductReviews 
						setRate={this.setRate.bind(this)} 
						setText={this.setText.bind(this)} 
						addReview={this.addReview.bind(this)} 
						showAuthForm={this.showAuthForm.bind(this)} 
						hide={this.state.hideProductReviews} 
						reviews={this.state.reviews} 
						logged={this.state.isLogged}
						product={this.state.product}
						reviewAlert={this.state.reviewAlert}

						reviewRate={this.state.reviewRate}
						reviewText={this.state.reviewText}
					/>
				</ProductPage>
			</div>
		);
	}
}













// headers: {
	// 'Accept': 'application/json',
	// 'Content-Type': 'application/json'
	// 'Authorization': 'Token ' + AAAtoken
// },
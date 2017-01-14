import React from 'react';
import Promise from 'promise-polyfill'; 
if (!window.Promise) {window.Promise = Promise;}
import 'whatwg-fetch';

import ProductReviews 					from './ProductReviews';

import { UrlConst } 					from '../const/UrlConst';
import { AuthAlerts, ReviewAlerts } 	from '../const/Alerts';

import { ProductList } 					from '../components/ProductList';
import { ProductPage } 					from '../components/ProductPage';
import { RegLogForm } 					from '../components/RegLogForm';
import { AuthControl } 					from '../components/AuthControl';


export default class App extends React.Component{
	constructor(){ super();
		this.state = {
			products: [],
			reviews: [],

			token: '',

			product: null,

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


	submitLogin(e){
		e.preventDefault();
		this.authorize(UrlConst.log);
	}
	submitReg(e){
		e.preventDefault();
		this.authorize(UrlConst.reg);
	}

	authorize(url){
		if( this.validateAuthForm(this.state.login, this.state.pass) ) return null;

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
	

	showProduct(id, product){
		this.setState({
			hideProductList: true,
			hideProductPage: false,
			hideProductReviews: false,
			product: product
		});

		this.getReviewsByID(UrlConst.reviews, id)
			.then( data => { this.setState({reviews: data}); });
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
						showAuthForm={this.showAuthForm.bind(this)} 
						hide={this.state.hideProductReviews} 
						reviews={this.state.reviews} 
						logged={this.state.isLogged}
						product={this.state.product}
						token={this.state.token}
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
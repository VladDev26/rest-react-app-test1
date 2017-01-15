import React from 'react';
import Promise from 'promise-polyfill'; 
if (!window.Promise) {window.Promise = Promise;}
import 'whatwg-fetch';

import ProductReviews 					from './ProductReviews';
import AuthForm 						from './AuthForm';

import UrlConst 						from '../const/UrlConst';
import { AuthAlerts } 					from '../const/Alerts';

import { ProductList } 					from '../components/ProductList';
import { ProductPage } 					from '../components/ProductPage';
import { AuthControl } 					from '../components/AuthControl';


export default class App extends React.Component{
	constructor(){ super();
		this.state = {
			products: [],
			reviews: [],

			product: null,

			hideForm: true,
			hideProductList: false,
			hideProductPage: true,
			hideProductReviews: true,
			hideAuthControl: false,

			token: null,
			isLogged: false
		};
	}

	componentDidMount(){
		this.getJSON(UrlConst.products)
			.then(products => this.setState({ products }) );
	}

	getJSON(url){
		return fetch(url)
			.then(response => response.json())
			.then(json => json)
			.catch(ex => console.log('parsing failed', ex));
	}

	showProduct(id, product){
		this.setState({
			hideProductList: true,
			hideProductPage: false,
			hideProductReviews: false,
			product: product
		});

		this.getJSON(UrlConst.reviews + id)
			.then( reviews => { this.setState({ reviews }); });
	}


	showAuthForm(){
		this.setState({
			hideForm: false,
			hideAuthControl: true
		});
	}

	setLogged(flag){ this.setState({isLogged: flag}); }

	setToken(token){ this.setState({ token }); }


	render(){
		return(
			<div className="container my-4">
				<AuthControl 
					hide={this.state.hideAuthControl} 
					showAuthForm={this.showAuthForm.bind(this)} 
				/>

				<AuthForm 
					setLogged={this.setLogged.bind(this)}
					setToken={this.setToken.bind(this)}
					hide={this.state.hideForm}
					logged={this.state.isLogged}
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

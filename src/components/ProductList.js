import React from 'react';

export const ProductList = props => {
	let product = props.products.map( item => {
		return(
			<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
				<div className="card text-center my-2" style={{background: '#2a2b32'}}>
					<div style={{cursor: 'pointer'}} onClick={() => props.showProduct(item.id, item)}>
						<img className="card-img-top" 
							src={'http://smktesting.herokuapp.com/static/' + item.img} alt=""/>
						<div className="card-block">
							<h4 className="card-title">{item.title}</h4>
							<p className="card-text">{item.text}</p>
						</div>
					</div>
				</div>
			</div>
		);
	});
	let pattern = (
		<div className="my-4 row">
			{product}
		</div>
	);
	
	return props.hide ? null : pattern;
};
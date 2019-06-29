import React from 'react';
import './Stock.css';

const Stock = (props) => {
  
  const {change, changePercent, latestPrice, symbol} = props;

  return (
  	<div className={change >= 0 ? "card pos" : "card neg"}>
      <h2 className="change">{`${change >= 0 ? "+"+change.toFixed(2) : change.toFixed(2)} (${changePercent.toFixed(2)}%)`}</h2>
      <h1 className="ticker">{symbol}</h1>
      <h2 className="price">${latestPrice.toFixed(2)}</h2>
    </div>
  )
}

export default Stock;

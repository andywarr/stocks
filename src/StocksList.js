import React, {Component} from 'react';
import Stock from './Stock';
import './StocksList.css';

class StocksList extends Component {
  render() {
    const stocks = this.props.stocks.map((stock,index) => (
      <Stock key={stock.id} {...stock} />
    ));
    
    return (
      <div className="grid">
        {stocks}
      </div>
    )
  
  }
}

export default StocksList;

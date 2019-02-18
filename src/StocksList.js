import React, {Component} from 'react';
import {DraggableContainer, DraggableItem} from '@wuweiweiwu/react-shopify-draggable';
import Stock from './Stock';
import './StocksList.css';

class StocksList extends Component {
  constructor(props) {
     super(props);

     this.onSwap = this.onSwap.bind(this);
  }

  onSwap(event) {
    this.props.onSwap(event.data.oldIndex, event.data.newIndex);
  }

  render() {
    const stocks = this.props.stocks.map((stock,index) => (
      <DraggableItem
        as="div"
        className="Block"
        key={stock.symbol}
      >
        <Stock key={stock.symbol} {...stock} />
      </DraggableItem>
    ));
    
    return (
      <DraggableContainer
        as="div"
        type="sortable"
        className="BlockGenerator grid"
        mirror={{ xAxis: true, yAxis: true, constrainDimensions: true }}
        onSortableSorted={this.onSwap}
      >
        {stocks}
      </DraggableContainer>
    )
  
  }
}

export default StocksList;

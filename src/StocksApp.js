import React, { Component } from 'react';
import './StocksApp.css';
import StocksList from './StocksList';
import Toolbar from './Toolbar';

class StocksApp extends Component {
  constructor(props) {
    super(props);

    let stocks = JSON.parse(localStorage.getItem('stocks')) || [];

    this.state = {
      nextStockId: 0,
      search: "",
      stocks,
    }

    this.getStocks = this.getStocks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.swapAtIndex = this.swapAtIndex.bind(this);

    this.getStocks();

    setInterval(() => {
      this.getStocks();
    }, 10000)
  }

  handleChange(query) {
    this.setState({search: query.toLowerCase()});
  }

  handleDelete(id) {
    this.setState((prevState, props) => {
      const stocks = prevState.stocks.filter((stock) => (stock.id !== id));
      localStorage.setItem('stocks', JSON.stringify(stocks));
      return {
        nextStockId: prevState.nextStockId,
        search: prevState.search,
        stocks: stocks
      } 
    });
    
  }

  handleSave(stock) {
    this.setState((prevState, props) => {
      return {
        nextStockId: ++prevState.nextStockId,
        search: prevState.search,
        stocks: [...prevState.stocks, stock]
      }
    });
  }

  handleSwap(oldIndex, newIndex) {
    this.setState((prevState, props) => {
      const stocks = this.swapAtIndex(prevState.stocks, oldIndex, newIndex);
      localStorage.setItem('stocks', JSON.stringify(stocks));
      return {stocks};
    });
  }

  getStocks() {
    let nextStockId = 0;

    const promises = this.state.stocks.map((stock, index) => (
      fetch(`https://cloud.iexapis.com/stable/stock/${stock.symbol}/quote?token=pk_4faf5813fcb3433983a2e258885ea785&displayPercent=true`)
      .then((response) => (response.json()))));
    
    Promise.all(promises)
    .then((stocks) => (
      stocks.map((stock, index) => {
        return {
          ...stock,
          id: nextStockId++
        }
      })
    ))
    .then((stocks) => {
      this.setState({nextStockId, stocks});
      localStorage.setItem('stocks', JSON.stringify(stocks));
    });
  }

  render() {
    return (
      <div className="App">
        <Toolbar 
          onChange={this.handleChange}
          onDelete={this.handleDelete} 
          onSave={this.handleSave}
          stocks={this.state.stocks} />
        <StocksList
          onSwap={this.handleSwap} 
          stocks={this.state.stocks.filter((stock) => (
            stock.symbol.toLowerCase().includes(this.state.search)
          ))} />
      </div>
    );  
  }

  swapAtIndex(arr, fromIndex, toIndex) {
    const newArr = arr.slice();
    const val = newArr[fromIndex];

    newArr.splice(fromIndex, 1);
    newArr.splice(toIndex, 0, val);

    return newArr;
  }
}

export default StocksApp;

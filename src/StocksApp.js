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

    this.getStocks();

    setInterval(() => {
      this.getStocks();
    }, 10000)
  }

  handleChange(query) {
    this.setState({search: query});
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
      const newStock = {
        change: Number.parseFloat(stock.change),
        changePercent: Number.parseFloat(stock.changePercent),
        price: Number.parseFloat(stock.latestPrice),
        ticker: `${stock.symbol}`, 
        id: this.state.nextStockId};
      return {
        nextStockId: prevState.nextStockId + 1,
        search: prevState.search,
        stocks: [...prevState.stocks, newStock]
      }
    });
  }

  getStocks() {
    let nextStockId = -1;

    const promises = this.state.stocks.map((stock, index) => (
      fetch(`https://api.iextrading.com/1.0/stock/${stock.ticker}/quote?displayPercent=true`)
      .then((response) => (response.json()))));
    
    Promise.all(promises)
    .then((stocks) => (
      stocks.map((stock, index) => {
        nextStockId += 1;
        
        return {
          change: Number.parseFloat(stock.change),
          changePercent: Number.parseFloat(stock.changePercent),
          id: nextStockId,
          price: Number.parseFloat(stock.latestPrice),
          ticker: `${stock.symbol}`
        }
      })
    ))
    .then((stocks) => {
      nextStockId += 1;
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
        <StocksList stocks={this.state.stocks.filter((stock) => (
          stock.ticker.toLowerCase().includes(this.state.search)
        ))} />
      </div>
    );  
  }
}

export default StocksApp;

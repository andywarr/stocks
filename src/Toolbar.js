import React, {Component} from 'react';
import './Toolbar.css';

class Toolbar extends Component {
  constructor(props) {
     super(props);

     this.state = {
      search: ""
     };

     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    document.getElementById("search").classList.remove("error");

    let search = event.target.value;

    this.setState({search});

    this.props.onChange(search);
  }

  handleSubmit(event) {
    event.preventDefault();

    let symbol = this.state.search;
    let stock = this.props.stocks.find((stock) => (stock.symbol.toLowerCase() === symbol.toLowerCase()));

    if (stock) {
      this.props.onDelete(stock.id);
    } else {
      fetch(`https://api.iextrading.com/1.0/stock/${symbol}/quote?displayPercent=true`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Stock not returned")
        } else {
          return response.json();
        }
      })
      .then((data) => (this.props.onSave(data)))
      .catch((error) => {
        document.getElementById("search").classList.add("error");
      });
    }
  }

  render() {
    return (<form onSubmit={this.handleSubmit}>
              <input
                autoComplete="off" 
                id="search"
                onChange={this.handleChange}
                placeholder="Type stock symbol to add, filter and remove stocks"
                type="text" />
            </form>)
  }
}

export default Toolbar;

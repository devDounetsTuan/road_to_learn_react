import React, { Component /* , PureComponent */ } from "react";
//import logo from './logo.svg';
import "./App.css";
const DEFAULT_QUERY = "redux";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';
const PARAM_HPP = 'hitsPerPage=';


const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}${DEFAULT_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      //list: list,
    };
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }


  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    //  console.log(hits);
    //console.log(oldHits);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
        }
    });
    // console.log(result);
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();

  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id
    );
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  //render
  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    if (!result) {
      return null;
    }
    return (

      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>

        </div>

        {result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}>
            More
              </Button>
        </div>
      </div >
    );
  }
}

//function stateless component
const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) => {
  const largeColumn = {
    width: "40%"
  };
  const midColumn = {
    width: "30%"
  };
  const smallColumn = {
    width: "10%"
  };
  //console.log(list);
  return (
    <div className="table">
      {list.map(item => (
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
              </Button>
          </span>
        </div>
      ))}
    </div>
  );

}
class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;
    //  console.log('log');
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}
export default App;

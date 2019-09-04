import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class App extends Component {
  state = {
    newElement: '',
  }

  handleChange = (event) => {
    this.setState({
      newElement: event.target.value,
    });
  }

  getElements = () => {
    this.props.dispatch({ type: 'GET_ELEMENTS' });
  }

  componentDidMount() {
    this.getElements();
  }

  handleClick = () => {
    this.props.dispatch({ type: 'PUT_ELEMENT', payload: this.state });

    this.setState({
        newElement: '',
    });
    
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.dispatch({ type: 'BUTTON_ONE' })}>Button One</button>
        <button onClick={() => this.props.dispatch({ type: 'BUTTON_TWO' })}>Button Two</button>
        <input value={this.state.newElement} onChange={this.handleChange} />
        <button onClick={this.handleClick}>Add Element</button>
        <pre>{JSON.stringify(this.props.reduxState)}</pre>
      </div>
    );
  }
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(App);

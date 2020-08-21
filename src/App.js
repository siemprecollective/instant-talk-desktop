import React from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import { db } from './client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '' }
  }

  onLogin(userId) {
    this.setState({id: userId});
  }

  render() {
    return (
      <div className="app">
        <div className="draggable-top"></div>
        {this.state.id ? <Home id={this.state.id} /> : <Login onLogin={this.onLogin.bind(this)} />}
      </div>
    );
  }
}

export default App;

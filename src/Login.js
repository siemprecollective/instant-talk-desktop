import React from 'react';
import './Login.css';
import { db } from './client';

class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      username: '',
      id: ''
    }
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handleIdChange(event) {
    this.setState({id: event.target.value});
  }

  onClickLogin() {
    if (this.state.id !== "") {
      let userRef = db.collection("users").doc(this.state.id);
      userRef.get().then(doc => {
        if (doc.exists) {
          if (doc.data()['name'] === this.state.username) {
            console.log("Names match");
            this.props.onLogin(this.state.id);
          } else {
            console.log("Names don't match");
          }
          console.log("Document data:", doc.data());
        } else {
          console.log("No such document");
        }
      }).catch(err => {
        console.log("Error: ", err);
      });
    }
  }

  render() {
    return (
      <div className="center-container">
        <div>
          Username: <input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChange.bind(this)}/><br/>
          ID: <input type="text" name="id" value={this.state.id} onChange={this.handleIdChange.bind(this)}/>
        </div>
        <button className="login-button" onClick={() => {this.onClickLogin()}}>Login</button>
      </div>
    );
  }
}

export default Login;

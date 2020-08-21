import React from 'react';
import FriendBubble from './FriendBubble';
import { db } from './client';

class Friends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    db.collection("users").doc(this.props.id).get()
      .then(doc => {
        let friends = doc.data()["friends"];
        friends.forEach(friend => {
          db.collection("users").doc(friend)
            .onSnapshot(friendDoc => {
              var friendObj = {}
              friendObj[friend] = friendDoc.data();
              this.setState(friendObj);
            })
        })
      })
  }

  callFriend(key) {
    if (this.state[key]['status'] == 0 || this.state[key]['status'] == 1) {
      this.props.callFunc(key);
    }
  }

  render() {
    let friendComponents = [];
    let stateKeys = Object.keys(this.state);
    stateKeys.forEach(key => {
      friendComponents.push(
        <FriendBubble
          photoURL={this.state[key]['photoURL']}
          friendStatus={this.state[key]['status']} 
          call={() => {this.callFriend(key)}}
          disconnect={() => {this.props.discFunc()}}
          inCall={(this.props.currentCall === key)}
          incomingCall={(this.props.incomingCall === key)}
        />
      );
    })
    
    return (
      <>
        {friendComponents}
      </>
    );
  }
}

export default Friends;

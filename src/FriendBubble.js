import React from 'react';
import './FriendBubble.css';
import phone from './assets/phone.svg';

let colorCodes = ["green", "red", "purple", "blue"];

class Friends extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickFriend() {
    if (this.props.inCall) {
      this.props.disconnect();
    } else {
      this.props.call();
    }
  }

  render() {
    let photoClassName = "photo";
    if (this.props.incomingCall) {
      photoClassName += " calling";
    } else if (this.props.inCall) {
      photoClassName += " in-call";
    }

    return (
      <div className="bubble-container" onClick={this.onClickFriend.bind(this)}>
        <img src={this.props.photoURL} className={photoClassName}/>
        {this.props.incomingCall ? <img src={phone} className="phone-icon" /> : null}
        <div className={"status " + colorCodes[this.props.friendStatus]}></div> 
      </div>
    );
  }
}

export default Friends;

import React from 'react';
import './AddFriend.css';
import { db } from './client';
import arrow_back from './assets/arrow_back.svg';

class AddFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = { friendID: '' }
  }

  handleIdChange(event) {
    this.setState({friendID: event.target.value});
  }

  onClickAddFriend() {
    console.log(this.state);
    console.log(this.props);
    if (this.state.friendID !== "") {
      var self = this;
      let userRef = db.collection("users").doc(this.props.id);
      let friendRef = db.collection("users").doc(this.state.friendID);
      friendRef.get().then(doc => {
        if (doc.exists) {
          let data = doc.data();
          if (data["friends"].includes(self.props.id)) {
            console.log("Already friends!");
          } else if (data["outgoingRequests"].includes(self.props.id)) {
            console.log(data);
            let newRequests = data["outgoingRequests"].filter(id => (id !== self.props.id));
            let newFriends = data["friends"].concat([self.props.id]);
            friendRef.update({
              outgoingRequests: newRequests,
              friends: newFriends
            }).then(() => {
              console.log("got here");
              return userRef.get();
            }).then((doc) => {
              let newFriends = doc.data()["friends"].concat([self.state.friendID]);
              return userRef.update({
                friends: newFriends
              })
            }).then(() => {
              console.log("Successfully added friends!");
            }).catch(err => {
              console.log("Error: ", err);
            })
          } else {
            userRef.get().then((doc) => {
              console.log(doc.data());
              console.log(doc.data()["outgoingRequests"]);
              console.log(self.state.friendID);
              let newRequests = doc.data()["outgoingRequests"].concat([self.state.friendID]);
              console.log(newRequests);
              return userRef.update({
                outgoingRequests: newRequests
              })
            }).then(() => {
              console.log("Successfully sent friend request");
            }).catch(err => {
              console.log("Error: ", err);
            })
          }
        } else {
          console.log("No such person with that friend ID exists");
        }       
      }).catch(err => {
        console.log("Error: ", err);
      })
    }
  }

  render() {
    return (
      <>
        <div className="center-container">
          <div>
            Friend ID: <input type="text" name="id" value={this.state.friendID} onChange={this.handleIdChange.bind(this)}/>
          </div>
          <button className="add-friend-button" onClick={() => this.onClickAddFriend()}>Add Friend</button>
        </div>
        <div className="back-container">
          <div className="back-button" onClick={() => this.props.onBack()}>
            <div className="back-subcontainer">
              <div>
                <img src={arrow_back} className="back-content white-svg" />
              </div>
              <div className="back-content back-text">
                Back
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AddFriend;

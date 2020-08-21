import React from 'react';
import AcceptButtons from './AcceptButtons';
import AddFriend from './AddFriend';
import FriendBubble from './FriendBubble';
import Friends from './Friends';
import SetStatus from './SetStatus';
import './Home.css'
import { db } from './client';
import arrow_forward from './assets/arrow_forward.svg';

const Device = require('twilio-client').Device;

var device;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCall: null,
      incomingCall: null,
      incomingCallObject: null,
      myStatus: null,
      oldStatus: 2,
      onAddFriend: false
    };
  }

  componentDidMount() {
    db.collection("users").doc(this.props.id)
      .onSnapshot(doc => {
        let friends = doc.data()["friends"];
        this.setState({myStatus: doc.data()["status"]});
      })

    this.getTwilioDevice();
  }

  getTwilioDevice() {
    let self = this;

    fetch(
      'BLANK/token?identity=' + this.props.id + 'a',
      { method: 'GET' }
      ).then(response => {
        return response.json();
      }).then(json => {
        console.log('Token: ' + json.token);

        // Setup Twilio.Device
        device = new Device(json.token, {
          // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
          // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
          codecPreferences: ['opus', 'pcmu'],
          // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
          // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
          // a second time and sending the tone twice. This will be default in 2.0.
          fakeLocalDTMF: false,
        });

        device.on('ready',function (device) {
          console.log('Twilio.Device Ready!');
        });

        device.on('error', function (error) {
          console.log('Twilio.Device Error: ' + error.message);
          if (error.message === "JWT Token Expired") {
            self.getTwilioDevice();                  
          }
        });

        device.on('connect', function (conn) {
          console.log(conn);
          console.log(conn.parameters);
          console.log('Successfully established call!');
          self.setState({ oldStatus: self.state.myStatus === 3 ? 2 : self.state.myStatus });
          self.changeStatus(3);
        });

        device.on('disconnect', function (conn) {
          console.log('Call ended.');
          self.setState({ 
            currentCall: null,
            incomingCall: null,
            incomingCallObject: null
          });
          self.changeStatus(self.state.oldStatus);
        });

        device.on('incoming', function (conn) {
          console.log('Incoming connection from ' + conn.parameters.From);
          let incomingCallID = self.convertTwilioID(conn.parameters.From);
          if (self.state.myStatus == 0) {
            self.setState({
              incomingCall: incomingCallID,
              incomingCallObject: conn
            });
          } else {
            conn.reject();
          }
        });
      }).catch(err => {
        console.log(err);
      })
  }

  changeStatus(newStatus) {
    console.log("called with newStatus: ", newStatus);
    db.collection("users").doc(this.props.id).update({
      status: newStatus
    })
    .then(() => {
      console.log("Succesfully updated status");
    })
    .catch(err => {
      console.error("Error setting the status ", err);
    })
  }

  callToID(id) {
    let params = {
      to: id + "a"
    };

    console.log("Calling " + params.to + "...");
    if (device) {
      this.setState({ currentCall: id });
      device.connect(params);
    }
  }

  disconnect() {
    if (device) {
      device.disconnectAll();
    }
  }

  convertTwilioID(id) {
    // Ideally we should check that the last character is "a"
    // However we have that weird bug on twilio rn where 1234a => 12342
    return id.slice(0, -1);
  }

  addFriendPage() {
    console.log("Add friend page");
    this.setState({ onAddFriend: true });
  }

  notAddFriendPage() {
    this.setState({ onAddFriend: false });
  }

  acceptCall() {
    let newCall = this.state.incomingCall;
    this.state.incomingCallObject.accept();
    if (this.state.incomingCallObject.status() === "closed") {
      this.setState({
        currentCall: null,
        incomingCall: null,
        incomingCallObject: null
      })
    } else {
      this.setState({
        currentCall: newCall,
        incomingCall: null,
        incomingCallObject: null
      })
    }
  }

  rejectCall() {
    this.state.incomingCallObject.reject();
    this.setState({
      incomingCall: null,
      incomingCallObject: null
    })
  }

  render() {
    if (this.state.onAddFriend) {
      return (
        <AddFriend
          id={this.props.id}
          onBack={this.notAddFriendPage.bind(this)}
        />
      );
    } else {
      return (
        <>
          <div className="center-container">
            <div className="all-bubbles-container">
              <SetStatus
                myStatus={this.state.myStatus}
                changeStatus={this.changeStatus.bind(this)}
              />
              <Friends
                id={this.props.id}
                callFunc={this.callToID.bind(this)}
                discFunc={this.disconnect.bind(this)}
                currentCall={this.state.currentCall}
                incomingCall={this.state.incomingCall}
              />
            </div>
            <AcceptButtons
              incoming={this.state.incomingCall !== null}
              accept={this.acceptCall.bind(this)}
              reject={this.rejectCall.bind(this)}
            />
          </div>
          <div className="add-friend-container">
            <div className="add-button" onClick={() => this.addFriendPage()}>
              <div className="add-subcontainer">
                <div className="add-content add-text">
                  Add Friend
                </div>
                <div>
                  <img src={arrow_forward} className="add-content white-svg" />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default Home;

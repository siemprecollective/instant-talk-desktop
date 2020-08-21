import React from 'react';
import './AcceptButtons.css';

class AcceptButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.incoming ? "": "hidden"}>
        <button className="green" onClick={() => this.props.accept()}>Accept</button>
        <button onClick={() => this.props.reject()}>Decline</button>
      </div>
    );
  }
}

export default AcceptButtons;

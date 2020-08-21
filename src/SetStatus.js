import React from 'react';
import './SetStatus.css';

export default function SetStatus(props) {
  return (
    <div className="set-status-container">
      <div className={"set-status green " + (props.myStatus === 0 ? "" : "not-selected")} onClick={() => {props.changeStatus(0)}}></div>
      <div className={"set-status red " + (props.myStatus === 1 ? "" : "not-selected")} onClick={() => {props.changeStatus(1)}}></div>
      <div className={"set-status purple " + (props.myStatus === 2 ? "" : "not-selected")} onClick={() => {props.changeStatus(2)}}></div>
    </div>
  );
}

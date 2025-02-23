import React from "react";
import "./Empty.css";

const Empty = ({text}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">(￢_￢;)</div>
      <p className="empty-text">{text}</p>
    </div>
  );
};

export default Empty;
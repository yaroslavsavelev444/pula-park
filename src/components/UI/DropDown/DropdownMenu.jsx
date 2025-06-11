import React from 'react';
import Popup from 'reactjs-popup';
import './DropdownMenu.css';

const DropdownMenu = ({ options, onOptionClick, triggerText, triggerIcon }) => {
  return (
    <Popup
    trigger={<div className="menu-icon">{triggerIcon}</div>}
    position="right top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      arrow={false}
    >
      <div className="menu">
        {options.map((option, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => onOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </Popup>
  );
};

export default DropdownMenu;
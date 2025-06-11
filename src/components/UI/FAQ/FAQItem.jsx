import React, { useState } from 'react';
import Collapse from 'react-collapse';
import './FAQItem.css';

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={onToggle}>
        <span>{question}</span>
        <span className="faq-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      <Collapse isOpened={isOpen}>
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      </Collapse>
    </div>
  );
};

export default FAQItem;
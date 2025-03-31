import React, { useState } from "react";
import FAQItem from "../UI/FAQ/FAQItem";
import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const questionsAndAnswers = [
    {
      question:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, nihil?",
      answer: "Lorem ipsum dolor, sit amet consectetur adipisicing.",
    },
    {
      question:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, nihil??",
      answer: "Lorem ipsum dolor, sit amet consectetur",
    },
    {
      question:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, nihil??",
      answer: "Lorem ipsum dolor, sit amet consectetur",
    },
    {
      question:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, nihil??",
      answer: "Lorem ipsum dolor, sit amet consectetur.",
    },
  ];

  return (
    <div className="faq-wrapper">
      <div className="faq-container">
        {questionsAndAnswers.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
      <div className="img-faq">
       <img src="/img/main.png" alt="main" />
      </div>
    </div>
  );
};

export default FAQ;

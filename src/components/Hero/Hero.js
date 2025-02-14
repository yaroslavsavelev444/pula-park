import React from "react";
import "./Hero.css";
import "aos/dist/aos.css"; 

const Hero = () => {
  console.log("Hero рендерится!");

  return (
    <section id="hero" className="hero">
      <div>
        <h1>Добро пожаловать</h1>
      </div>
    </section>
  );
};

export default Hero;
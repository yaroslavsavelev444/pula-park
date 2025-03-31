import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import AOS from "aos";
import "aos/dist/aos.css"; 
import Button from "../UI/Buttons/Button";
import Typewriter from "typewriter-effect/dist/core";
import { FaAppStore, FaArrowDown, FaGooglePlay } from "react-icons/fa";

const Hero = () => {

  const typewriterRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    if ( typewriterRef.current) {
      new Typewriter(typewriterRef.current, {
        strings: ["ПРИМЕР ТЕКСТА", "ДРУГОЙ ПРИМЕР ТЕКСТА"],
        autoStart: true,
        loop: true,
      });
    }
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <section id="main-photo-wrapper" className="main-photo-wrapper" >
      <div className="main-photo">
        <div className="text-overlay">
          <h2 className="hero-title" ref={typewriterRef} data-aos="fade-up" >
            {typewriterRef.strings}
          </h2>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="1000" >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque veniam doloribus quis ratione eos nam.
          </p>
        </div>
        <div className="download-buttons">
          <Button className="main-download-btn appstore" data-aos="fade-up"  data-aos-delay="1000" >
            <FaAppStore size={40} />
            <div className="main-download-text">
              <p>App Store</p>
            </div>
          </Button>
          
          <Button className="main-download-btn googleplay">
            <FaGooglePlay size={40} />
            <div className="main-download-text">
              <p>Google Play</p>
            </div>
          </Button>
        </div>
      </div>
      <div className="main-img">
        <img src="/img/main.png" alt="main" />
      </div>

      <Button className="arrow-btn" haveBaccol={false} data-aos="fade-up" >
          <FaArrowDown size={40} onClick={scrollToProjects} />
        </Button>
    </section>
  );
};

export default Hero;
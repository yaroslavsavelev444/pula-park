import React from "react";
import Hero from "../components/Hero/Hero";
import MainSlider from "../components/UI/MainSlider/MainSlider";
import CountBlock from "../components/CountBlock/CountBlock";
import Faq from "../components/FAQ/FAQ";
import CarsСompilation from "../components/CarsСompilation/CarsСompilation";

const Home = () => {
  return (
    <>
      <Hero />
      <MainSlider />
      <CountBlock />
      <CarsСompilation/>
      <Faq />
    </>
  );
};

export default Home;
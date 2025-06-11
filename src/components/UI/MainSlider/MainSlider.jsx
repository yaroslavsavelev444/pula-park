import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import { Pagination, Mousewheel, Autoplay } from "swiper/modules";
import "./MainSlider.css";

const Slide = ({ title, description, category, action, bgClass }) => (
  <div className={`slide ${bgClass}`}>
    <div>
      <p className="category">{category}</p>
      <h2 className="title">{title}</h2>
      <p className="description">{description}</p>
    </div>
    <button className="action-button">{action}</button>
  </div>
);

export default function MainSlider() {
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiperInstance = swiperRef.current;

    const updateProgress = () => {
      if (!swiperInstance) return;
      const totalSlides = swiperInstance.slides.length;
      if (totalSlides > 1) {
        const currentProgress = (swiperInstance.activeIndex / (totalSlides - 1)) * 100;
        setProgress(currentProgress);
      }
    };

    swiperInstance.on("slideChange", updateProgress);
    updateProgress();

    return () => {
      swiperInstance.off("slideChange", updateProgress);
    };
  }, []);

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          direction="horizontal"
          slidesPerView={1.2}
          spaceBetween={20}
          mousewheel={true}
          autoplay={{ delay: 15000, disableOnInteraction: false }}
          modules={[Pagination, Mousewheel, Autoplay]}
          className="h-full"
        >
          <SwiperSlide>
            <Slide
              title="Scaling AI: Transforming the Oil & Gas Industry with AI Solutions"
              description="Join us for a webinar where we’ll explore several key ways AI can drive value in the oil and gas industry."
              category="WEBINAR"
              action="REGISTER NOW →"
              bgClass="bg-blue-dark"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Slide
              title="AI Maturity Assessment"
              description="Take the test to measure your organization across key AI capabilities."
              category="INSIGHT"
              action="Take the test →"
              bgClass="bg-blue-light"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Slide
              title="How to achieve AI success"
              description="Download the guide for chief marketing officers to transform AI adoption."
              category="INSIGHT"
              action="Download now →"
              bgClass="bg-gray-dark"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Slide
              title="Scaling AI: Transforming the Oil & Gas Industry with AI Solutions"
              description="Join us for a webinar where we’ll explore several key ways AI can drive value in the oil and gas industry."
              category="WEBINAR"
              action="REGISTER now →"
              bgClass="bg-blue-dark"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="progress-bar-wrapper">
         <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      </div>
     
    </div>
  );
}

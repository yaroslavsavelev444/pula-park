import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './StatsBlock.css';

const StatsBlock = ({ title, value }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Анимация сработает только один раз
    threshold: 1,    // Анимация начнется, когда блок будет виден на 50%
  });

  return (
    <div ref={ref} className="stats-block">
      <div className="stat-value">
        {inView && <CountUp start={0} end={value} duration={2.5} separator="," />}
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default StatsBlock;
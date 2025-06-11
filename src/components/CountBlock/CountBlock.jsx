import React from 'react';
import StatsBlock from '../UI/StatsBlock/StatsBlock';
import './CountBlock.css';

const CompanyStats = () => {
  return (
    <div className="company-stats-wrapper">
      <div className="company-stats">
        <StatsBlock title="Количество клиентов" value={1000} />
        <StatsBlock title="Прибыль" value={500000} />
        <StatsBlock title="Увеличение продаж" value={30} />
        <StatsBlock title="Количество сотрудников" value={20} />
      </div>
    </div>
  );
};

export default CompanyStats;
import React, { useState, useEffect } from "react";
import "./FilterBar.css";
import { SlCheck } from "react-icons/sl";
import Button from "../Buttons/Button";
import { MdClear } from "react-icons/md";

const FilterBar = ({ options, onChange, selectedFilters }) => {
  const [localSelectedFilters, setLocalSelectedFilters] = useState(selectedFilters);

  // Синхронизируем локальное состояние с изменениями в родительском компоненте
  useEffect(() => {
    setLocalSelectedFilters(selectedFilters);
  }, [selectedFilters]);

  const toggleFilter = (value) => {
    const newSelectedFilters = localSelectedFilters.includes(value)
      ? localSelectedFilters.filter((v) => v !== value)
      : [...localSelectedFilters, value];
    setLocalSelectedFilters(newSelectedFilters);
    onChange(newSelectedFilters);  // Обновляем родительское состояние
  };

  const applyFilters = () => onChange(localSelectedFilters);
  const clearFilters = () => {
    setLocalSelectedFilters([]);
    onChange([]);
  };

  return (
    <div className="filter-bar">
      {options.map(({ value, label, color, width }) => (
        <button
          key={value}
          onClick={() => toggleFilter(value)}
          className={`filter-button ${
            localSelectedFilters.includes(value) ? "active" : ""
          }`}
          style={{
            backgroundColor: localSelectedFilters.includes(value)
              ? color
              : "#f0f0f0",
            color: localSelectedFilters.includes(value) ? "#fff" : "#333",
            borderColor: color,
            width: width || "auto",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
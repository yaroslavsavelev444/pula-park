import React, { useState } from "react";
import "./FilterBar.css";
import { SlCheck } from "react-icons/sl";
import Button from "../Buttons/Button";
import { MdClear } from "react-icons/md";

const FilterBar = ({ options, onChange }) => {
  const defaultOption = options.find((option) => option.default)?.value || null;
  const [selectedFilters, setSelectedFilters] = useState(
    defaultOption ? [defaultOption] : []
  );

  const toggleFilter = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const applyFilters = () => onChange(selectedFilters);
  const clearFilters = () => {
    setSelectedFilters([]);
    onChange([]);
  };

  return (
    <div className="filter-bar">
      {options.map(({ value, label, color, width }) => (
        <button
          key={value}
          onClick={() => toggleFilter(value)}
          className={`filter-button ${
            selectedFilters.includes(value) ? "active" : ""
          }`}
          style={{
            backgroundColor: selectedFilters.includes(value)
              ? color
              : "#f0f0f0",
            color: selectedFilters.includes(value) ? "#fff" : "#333",
            borderColor: color,
            width: width || "auto",
          }}
        >
          {label}
        </button>
      ))}
      <div className="btns-filter-container">
        <Button onClick={applyFilters} className="apply-button">
          <SlCheck size={20} style={{ margin: 0 }} />
        </Button>
        <Button onClick={clearFilters} className="clear-button" haveBaccol={false}>
          <MdClear size={20} style={{ margin: 0, color: "red" }} />
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

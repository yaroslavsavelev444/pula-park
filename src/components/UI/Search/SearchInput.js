// SearchInput.js
import React from "react";
import "./SearchInput.css"; // Создадим стили для поиска

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-input-container">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
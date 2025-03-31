import React from 'react';
import Select from 'react-select';
import "./SelectMenu";

// Кастомный компонент Select
const SelectMenu = ({ options, value, onChange, label, placeholder }) => {
  return (
    <div className="select-container">
      {label && <label>{label}</label>}
      <Select
        value={options.find(option => option.value === value)}
        onChange={(selectedOption) => {
          // Передаем выбранное значение
          onChange(selectedOption ? selectedOption.value : '');
        }}
        options={options}
        placeholder={placeholder || "Выберите..."} 
        styles={{
          control: (base) => ({
            ...base,
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px',
            minWidth: '200px',
          }),
          singleValue: (base) => ({
            ...base,
            color: '#333',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
            color: state.isSelected ? '#333' : '#000',
            padding: '10px',
            cursor: 'pointer',
          }),
          menu: (provided) => ({
            ...provided,
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
          }),
        }}
      />
    </div>
  );
};

export default SelectMenu;
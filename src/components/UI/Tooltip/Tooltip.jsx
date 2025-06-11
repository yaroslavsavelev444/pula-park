import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip"; // импортируем библиотеку для тултипов

const Tooltip = ({ icon, text, id }) => {
  return (
    <div style={{position:"relative"}}>
      {/* Иконка с привязкой к tooltip */}
      <span data-tooltip-id={id} style={{ cursor: "pointer" }}>
        {icon}
      </span>

      {/* Tooltip с кастомными стилями */}
      <ReactTooltip
        id={id}
        place="left"
        effect="solid"
        style={{
          position: "absolute",  // Позиционирование тултипа
          zIndex: 9999,          // Высокий z-index для отображения поверх всего
          maxWidth: "none",      // Убираем ограничение по ширине
          whiteSpace: "normal",  // Позволяем тексте переноситься
          wordBreak: "break-word", // Прерывание длинных слов
        }}
      >
        {text}
      </ReactTooltip>
    </div>
  );
};

export default Tooltip;
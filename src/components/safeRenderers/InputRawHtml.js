import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import Input from '../UI/Input/Input';

const InputRawHtml = ({ onSave, value }) => {
  const [inputText, setInputText] = useState(value);

  // Функция очистки текста от вредоносных скриптов (XSS защита)
  const cleanText = (text) => {
    return DOMPurify.sanitize(text);
  };

  // Эффект для синхронизации состояния с переданным значением
  useEffect(() => {
    setInputText(value);
  }, [value]);

  // Обработчик изменения текста
  const handleChange = (e) => {
    const newText = e.target.value;
    setInputText(newText); // Сохраняем новое значение в локальном состоянии
    const sanitizedText = cleanText(newText); // Очищаем текст
    onSave(sanitizedText); // Сохраняем очищенный текст
};

  return (
    <Input
      className="modal-input"
      placeholder="Введите описание"
      value={inputText}
      onChange={handleChange} // Используем новый обработчик
    />
  );
};

export default InputRawHtml;
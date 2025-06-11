import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "../Buttons/Button"; // Убедитесь, что ваш компонент Button работает корректно.

import "./AvatarUpload.css";
import { log } from "../../../utils/logger";

const AvatarUpload = ({ onSubmit }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(true); 
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  // Обработка изменения файла
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        log("Image loaded:", reader.result); // Диагностика изображения
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка обрезки изображения
  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          setCroppedImage(URL.createObjectURL(blob)); // Используем URL.createObjectURL для отображения изображения
          onSubmit(blob); // Отправляем его родительскому компоненту
          setIsCropping(false); // Скрываем форму обрезки
        }, "image/png");
      }
    }
  };

  // Функция для сброса всех состояний
  const handleReset = () => {
    setImage(null);
    setCroppedImage(null);
    setIsCropping(true); // Возвращаем форму обрезки
  };

  return (
    <div className="avatar-upload">
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      {image && isCropping && (
        <div className="cropper-container">
          <Cropper
            src={image}
            ref={cropperRef}
            style={{ width: "100%", height: "auto" }}
            aspectRatio={1} // Соотношение сторон 1:1 для аватара
            guides={false} // Отключаем сетку
          />
          <Button onClick={handleCrop}>Обрезать</Button>
        </div>
      )}
      {croppedImage && !isCropping && (
        <div className="avatar-preview" style={{justifyContent:"center", padding:"5% 0 "}}>
          <img 
            src={croppedImage} 
            alt="Cropped Avatar" 
            className="cropped-avatar" 
          />
          {/* Кнопка удаления */}
          <Button onClick={handleReset}>Удалить</Button>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./CarImagesUpload.css";

const CarImagesUpload = ({ onSubmit }) => {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (images.length >= 10) {
      alert("Максимум 10 фото");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          const newImage = { id: Date.now(), blob, url: URL.createObjectURL(blob) };
          setImages((prev) => {
            const updatedImages = [...prev, newImage];
            onSubmit(updatedImages); // Передаём весь массив
            return updatedImages;
          });
          setImage(null);
          setIsCropping(false);
        }, "image/png");
      }
    }
  };

  const handleDelete = (id) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== id);
      onSubmit(updatedImages); // Передаём обновлённый список в родитель
      return updatedImages;
    });
  };

  return (
    <div className="car-images-upload">
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
      {isCropping && (
        <div className="cropper-container">
          <Cropper
            src={image}
            ref={cropperRef}
            style={{ width: "100%", height: "auto" }}
            aspectRatio={4 / 3}
            guides={false}
          />
          <button onClick={handleCrop}>Обрезать</button>
        </div>
      )}
      <div className="image-preview">
        {images.map((img) => (
          <div key={img.id} className="thumbnail">
            <img src={img.url} alt="Car" />
            <button onClick={() => handleDelete(img.id)}>✖</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarImagesUpload;
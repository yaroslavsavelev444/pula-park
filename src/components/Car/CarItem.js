import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./Car.css";
import { FaEllipsisV } from "react-icons/fa";
import DropdownMenu from "../UI/DropDown/DropdownMenu";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";

const CarCard = ({ car, handleFetchCarsData, onClick }) => {

  const {companyStore, store} = useContext(Context);

  const {
    carData: { licensePlate, vin },
    characteristics: { brand, model, year, fuelType, transmissionType },
    rentalOptions: { price_per_day , deposit_amount },

    photos,
  } = car;

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const options = car.carStatus.status === "available"
  ? ["Архив", "Удалить"]
  : car.carStatus.status === "unavailable"
  ? ["Вернуть", "Удалить"]
  : [""];


  const handleOptionClick = async (option) => {
    if (option === "Архив") {
      await companyStore.archiveCar(car._id);
    } else if (option === "Удалить") {
      await companyStore.deleteCar(car._id);
    }
    else if (option === "Вернуть") {
      await companyStore.returnCar(car._id);
    }
    handleFetchCarsData();
  };


  const handleMouseMove = (e) => {
    const cardWidth = e.currentTarget.offsetWidth;
    const mousePosition = e.nativeEvent.offsetX;
    const newIndex = Math.floor((mousePosition / cardWidth) * photos.length);
    setCurrentPhotoIndex(newIndex);
  };

  const goToPhoto = (index) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="car-card" onClick={() => onClick(car)}>
      <div className="car-card__image" onMouseMove={handleMouseMove}>
        <img
          src={photos?.[currentPhotoIndex] || "/default-car.jpg"}
          alt={`${brand} ${model}`}
        />
        <div className="image-navigation">
          {photos.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentPhotoIndex ? "active" : ""}`}
              onClick={() => goToPhoto(index)}
            ></div>
          ))}
        </div>
      </div>
      <div className="car-card__info">
        <h3>
          {brand} {model} ({year})
        </h3>
        <div className="car-info-bit">
          <p className="modal-info-item">
            <strong>Номер:</strong> {licensePlate}
          </p>
          <p className="modal-info-item">
            <strong>КПП:</strong> {transmissionType}
          </p>
          <p className="modal-info-item">
            <strong>Депозит:</strong>
            {deposit_amount ? `${deposit_amount} ₽` : "Нет"}
          </p>
          <p className="modal-info-item">
            <strong>Цена в день:</strong>{" "}
            {price_per_day ? `${price_per_day} ₽` : "Не указана"}
          </p>
          <p className="modal-info-item">
            <strong>Статус:</strong>
            {car.carStatus.status === "available" ? "Доступен" : "Недоступен"}
          </p>
        </div>
      </div>
      <DropdownMenu
        triggerIcon={<FaEllipsisV size={20} />} 
        options={options}
        onOptionClick={handleOptionClick}
      />
    </div>
  );
};

CarCard.propTypes = {
  car: PropTypes.shape({
    carData: PropTypes.shape({
      licensePlate: PropTypes.string.isRequired,
      vin: PropTypes.string.isRequired,
    }).isRequired,
    characteristics: PropTypes.shape({
      brand: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      fuelType: PropTypes.string,
      transmissionType: PropTypes.string,
    }).isRequired,
    rentalOptions: PropTypes.shape({
      price_per_day: PropTypes.number,
    }),
    photos: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default observer(CarCard);

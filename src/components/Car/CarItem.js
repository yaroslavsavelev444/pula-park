import React from "react";
import PropTypes from "prop-types";
import "./Car.css";

const CarCard = ({ car }) => {
  const {
    carData: { licensePlate, vin },
    characteristics: { brand, model, year, fuelType, transmissionType },
    rentalOptions: { price_per_day },
    photos,
  } = car;

  return (
    <div className="car-card">
      <div className="car-card__image">
        <img src={photos?.[0] || "/default-car.jpg"} alt={`${brand} ${model}`} />
      </div>
      <div className="car-card__info">
        <h3>{brand} {model} ({year})</h3>
        <p><strong>VIN:</strong> {vin}</p>
        <p><strong>Номер:</strong> {licensePlate}</p>
        <p><strong>Топливо:</strong> {fuelType}</p>
        <p><strong>КПП:</strong> {transmissionType}</p>
        <p><strong>Цена в день:</strong> {price_per_day ? `${price_per_day} ₽` : "Не указана"}</p>
      </div>
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

export default CarCard;
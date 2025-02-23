import React from "react";
import PropTypes from "prop-types";
import "./Car.css";
import { observer } from "mobx-react-lite";

const CarCardSimple = ({ car }) => {
  const {
    carData: { licensePlate },
    characteristics: { brand, model, year },
    photos,
  } = car;
  return (
    <div className="car-card-bit">
      <div className="car-card-image-bit">
        <img
          src={photos?.[0] || "/default-car.jpg"} // Используем первое фото
          alt={`${brand} ${model}`}
        />
      </div>
      <div className="car-card-info-bit">
        <h3>
          {brand} {model} ({year})
        </h3>
        <p>
          {licensePlate}
        </p>
      </div>
    </div>
  );
};

CarCardSimple.propTypes = {
  car: PropTypes.shape({
    carData: PropTypes.shape({
      licensePlate: PropTypes.string.isRequired,
    }).isRequired,
    characteristics: PropTypes.shape({
      brand: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default observer(CarCardSimple);
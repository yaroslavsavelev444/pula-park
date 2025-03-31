import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./Car.css";
import { FaEllipsisV } from "react-icons/fa";
import DropdownMenu from "../UI/DropDown/DropdownMenu";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import { getCarShiftBox, getCarStatus, getFuelType } from "../constants/maps";
import { optionsMap } from "../constants/options";

const CarCard = ({ car, handleFetchCarsData, onClick, isClickable }) => {
  const { companyStore } = useContext(Context);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = car?.photos?.length ? car.photos : ["/default-car.jpg"];
  const carStatus = car?.carStatus?.status || "unknown";
  const { carData, characteristics, rentalOptions } = car;
  
  const options = optionsMap[carStatus] || [];

  const handleOptionClick = async (option) => {
    try {
      if (option === "Архив") await companyStore.archiveCar(car._id);
      else if (option === "Удалить") await companyStore.deleteCar(car._id);
      else if (option === "Вернуть") await companyStore.returnCar(car._id);
      await handleFetchCarsData();
    } catch (error) {
      console.error("Ошибка обработки опции:", error);
    }
  };

  const handleMouseMove = (e) => {
    if (photos.length <= 1) return;
    const cardWidth = e.currentTarget.offsetWidth;
    const mousePosition = e.nativeEvent.offsetX;
    setCurrentPhotoIndex(Math.min(Math.floor((mousePosition / cardWidth) * photos.length), photos.length - 1));
  };

  return (
    <div className={`car-card-main ${isClickable ? "clickable" : ""}`} onClick={isClickable ? () => onClick(car) : undefined}>
      <div className="car-card__image" onMouseMove={handleMouseMove}>
        <img src={photos[currentPhotoIndex]} alt={`${characteristics.brand} ${characteristics.model}`} />
        {photos.length > 1 && (
          <div className="image-navigation">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentPhotoIndex ? "active" : ""}`}
                onClick={() => setCurrentPhotoIndex(index)}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="car-info-bit-wrapper">
        <h3>{characteristics.brand} {characteristics.model} ({characteristics.year})</h3>
        <div className="car-info-bit">
          <p><span className="point"></span> {getCarShiftBox(characteristics.transmissionType)}, {getFuelType(characteristics?.fuelType)}</p>
          {isClickable && <p><span className="point-green"></span> {getCarStatus(carStatus)}</p>}
        </div>
      </div>

      <hr className="line" />
      
      <div className="car-card-pricing-main">
        <div className="price-per-day-main">{rentalOptions?.price_per_day ? `${rentalOptions.price_per_day} ₽` : "Не указана"}</div>
        <p className="deposit-amount-main">{rentalOptions?.deposit_amount ? `${rentalOptions.deposit_amount} ₽` : "Без депозита"}</p>
      </div>

      {isClickable && options.length > 0 && (
        <DropdownMenu triggerIcon={<FaEllipsisV size={20} />} options={options} onOptionClick={handleOptionClick} />
      )}
    </div>
  );
};

CarCard.propTypes = {
  car: PropTypes.shape({
    carData: PropTypes.shape({ licensePlate: PropTypes.string.isRequired }).isRequired,
    characteristics: PropTypes.shape({
      brand: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      fuelType: PropTypes.string,
      transmissionType: PropTypes.string,
    }).isRequired,
    rentalOptions: PropTypes.shape({ price_per_day: PropTypes.number, deposit_amount: PropTypes.number }),
    photos: PropTypes.arrayOf(PropTypes.string),
    carStatus: PropTypes.shape({ status: PropTypes.string }),
    _id: PropTypes.string.isRequired,
  }).isRequired,
  handleFetchCarsData: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isClickable: PropTypes.bool.isRequired,
};

export default observer(CarCard);

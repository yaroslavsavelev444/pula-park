import React, { useEffect, useState } from "react";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import PropTypes from "prop-types";
import "../Car/Car.css"; // Подключаем стили
import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import { companyStore } from "../..";
import { getCarClass, getCarShiftBox, getCarStatus, getCarWd, getFuelType, getVehicleType } from "../constants/maps";
import { showToast } from "../../services/toastService";

const CarModalContent = ({ car, onClose }) => {
  const [pricePerDay, setPricePerDay] = useState(
    car.rentalOptions.price_per_day
  );
  const [depositAmount, setDepositAmount] = useState(
    car.rentalOptions.deposit_amount
  );
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose(); // Закрытие модалки
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Структура изображений для Gallery
  const images = car.photos?.map((photo) => ({
    original: photo,
    thumbnail: photo,
  }));

  // Конфигурация Gallery для отображения только миниатюр
  const galleryOptions = {
    showFullscreenButton: true, // Убираем кнопку полноэкранного режима
    showPlayButton: false, // Убираем кнопку воспроизведения слайдшоу
    showNav: false, // Убираем навигацию (стрелки)
    thumbnailPosition: "bottom", // Размещение миниатюр внизу
    showThumbnails: true, // Показываем только миниатюры
  };

  const handleChangeCarData = () => {
    if (
      pricePerDay <= 1000 ||
      depositAmount < 0 ||
      pricePerDay < 0 ||
      !pricePerDay
    ) {
      showToast({
        text1: "Отредактируйте цену",
        type: "error",
      });
      return;
    }
    companyStore.updateCarData(car._id, depositAmount, pricePerDay);
  };

  return (
    <div className="car-modal-content">
      <h1>
        {car.characteristics?.brand} {car.characteristics?.model} (
        {car.characteristics?.year})
      </h1>
      <div className="modal-wrapper">
        <div className="car-modal-gallery">
          <Gallery items={images} showThumbnails={true} {...galleryOptions} />
          <>
            <div className="modal-info-item">
              <span>Статус:</span> {getCarStatus(car.carStatus.status)}
            </div>
            <Input
              value={car.rentalOptions?.price_per_day ? pricePerDay : null}
              onChange={(e) => setPricePerDay(e.target.value)}
              placeholder={"Цена за день"}
            />
            <Input
              value={car.rentalOptions?.deposit_amount ? depositAmount : null}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder={"Депозит"}
            />
            {(car.rentalOptions?.price_per_day !== pricePerDay ||
              car.rentalOptions?.deposit_amount !== depositAmount) && (
              <Button onClick={handleChangeCarData}>Сохранить</Button>
            )}
          </>
        </div>

        <div className="modal-info">
          <h4>Детали предложения</h4>
          <div className="modal-info-items">
            <div className="modal-info-item">
              <span>Марка:</span> {car.characteristics?.brand}
            </div>
            <div className="modal-info-item">
              <span>Модель:</span> {car.characteristics?.model}
            </div>
            <div className="modal-info-item">
              <span>Год выпуска:</span> {car.characteristics?.year}
            </div>
            <div className="modal-info-item">
              <span>Тип авто:</span> {getVehicleType(car.characteristics?.vehicle_type)}
            </div>
            <div className="modal-info-item">
              <span>Класс авто:</span> {getCarClass(car.characteristics?.car_class)}
            </div>
            <div className="modal-info-item">
              <span>Количество мест:</span> {car.characteristics?.seats}
            </div>
            <div className="modal-info-item">
              <span>Объем багажника:</span>{" "}
              {car.characteristics?.trunk_volume ?? "—"}
            </div>
            <div className="modal-info-item">
              <span>Пробег:</span> {car.characteristics?.mileage} км
            </div>
            <div className="modal-info-item">
              <span>Коробка передач:</span>{" "}
              {getCarShiftBox(car.characteristics?.transmissionType)}
            </div>
            <div className="modal-info-item">
              <span>Тип топлива:</span> {getFuelType(car.characteristics?.fuelType)}
            </div>
            <div className="modal-info-item">
              <span>Привод:</span> {getCarWd(car.characteristics?.wdType)}
            </div>
            <div className="modal-info-item">
              <span>Гос. номер:</span> {car.carData?.licensePlate}
            </div>
            <div className="modal-info-item">
              <span>VIN:</span> {car.carData?.vin}
            </div>
            <div className="modal-info-item">
              <span>Статус:</span> {getCarStatus(car.carStatus?.status)}
            </div>
            <div className="modal-info-item">
              <span>Забронировано:</span>{" "}
              {car.carStatus?.is_reserved ? "Да" : "Нет"}
            </div>
            <div className="modal-info-item">
              <span>Дата последнего ТО:</span>{" "}
              {car.service?.last_service_date
                ? new Date(car.service.last_service_date).toLocaleDateString()
                : "—"}
            </div>
            <div className="modal-info-item">
              <span>Страховка до:</span>{" "}
              {car.service?.insurance_valid_until
                ? new Date(
                    car.service.insurance_valid_until
                  ).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CarModalContent.propTypes = {
//   car: PropTypes.shape({
//     photos: PropTypes.arrayOf(PropTypes.string),
//     characteristics: PropTypes.shape({
//       brand: PropTypes.string,
//       model: PropTypes.string,
//       year: PropTypes.number,
//       vehicle_type: PropTypes.string,
//       car_class: PropTypes.string,
//       seats: PropTypes.number,
//       trunk_volume: PropTypes.number,
//       mileage: PropTypes.number,
//       transmissionType: PropTypes.string,
//       fuelType: PropTypes.string,
//       wdType: PropTypes.string,
//     }),
//     carData: PropTypes.shape({
//       licensePlate: PropTypes.string,
//       vin: PropTypes.string,
//     }),
//     ownerData: PropTypes.shape({
//       owner: PropTypes.string,
//     }),
//     carStatus: PropTypes.shape({
//       status: PropTypes.string,
//       is_reserved: PropTypes.bool,
//     }),
//     service: PropTypes.shape({
//       last_service_date: PropTypes.string,
//       insurance_valid_until: PropTypes.string,
//     }),
//     rentalOptions: PropTypes.shape({
//       price_per_day: PropTypes.number,
//       deposit_amount: PropTypes.number,
//     }),
//   }),
// };

export default CarModalContent;

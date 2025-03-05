import React from "react";
import PropTypes from "prop-types";
import "./RentalItem.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock } from "lucide-react";
const formatDate = (isoString) => {
  if (!isoString) return "Неизвестно";
  const date = new Date(isoString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTime = (isoString) => {
  if (!isoString) return "Неизвестно";
  const date = new Date(isoString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RentalItem = ({ rental, onClick }) => {
  if (!rental || !rental.rental) {
    return <p className="request-item">Данные аренды недоступны</p>;
  }

  return (
    <div className="request-item" onClick={() => onClick(rental)}>
      <div className="request-item__row">
        <CarItemBit car={rental.rental.car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={rental.rental.user} />
      </div>
      <div className="request-item__row">
        <p className="request-item__value">
            <div className="item-row">  <Clock /> <p> С: </p> {formatDate(rental.dates?.startDate?.date)} {formatTime(rental.dates?.startDate?.time)}</div>
            <div className="item-row"> <Clock /> <p> До: </p>{formatDate(rental.dates?.endDate?.date)} {formatTime(rental.dates?.endDate?.time)}</div>
        </p>
      </div>
    </div>
  );
};

// PropTypes для валидации пропсов
RentalItem.propTypes = {
  rental: PropTypes.shape({
    rental: PropTypes.shape({
      car: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
    }).isRequired,
    dates: PropTypes.shape({
      startDate: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
      endDate: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
};

export default RentalItem;
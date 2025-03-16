import React from "react";
import PropTypes from "prop-types";
import "./RentalItem.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock, ArrowRight } from "lucide-react";
import { formatDate, formatTime } from "../../utils/formatMessageTime";

const RentalItemMini = ({ rental }) => {
  if (!rental || !rental.rental) {
    return <p className="request-item">Данные аренды недоступны</p>;
  }

  return (
    <div className="request-item">
      <div className="request-item__row">
        <CarItemBit car={rental.rental.car} />
        <UserProfileLight user={rental.rental.user} actions={true} />
      </div>
      <div className="request-item__row" style={{justifyContent:"center", gap:"10px"}}>
        
      <div style={{alignItems:"center", display:"flex", gap:"5px" , fontSize:"15px"}}>
          <Clock />
          {formatDate(rental.dates?.startDate?.date)}{" "}
          {formatTime(rental.dates?.startDate?.time)}
          </div>
          <p><ArrowRight /></p>
          <div style={{alignItems:"center", display:"flex", gap:"5px" , fontSize:"15px"}}>
          <Clock />
          {formatDate(rental.dates?.endDate?.date)}{" "}
          {formatTime(rental.dates?.endDate?.time)}
          </div>
      </div>
    </div>
  );
};

// PropTypes для валидации пропсов
RentalItemMini.propTypes = {
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

export default RentalItemMini;

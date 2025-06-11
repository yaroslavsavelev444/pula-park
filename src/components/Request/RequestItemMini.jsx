import React from "react";
import PropTypes from "prop-types";
import "./Request.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { AlertCircleIcon } from "lucide-react";

const RequestItemMini = ({
  request
}) => {
  const { user, car, phone, createdAt } = request;
  
  return (
    <div className="request-item request-item--mini">
        <div className="new-item-notificator"><AlertCircleIcon color="orange" size={30}/></div>
      <div className="request-item__row">
        <a href={`tel:${phone}`} className="request-item__link">
          {phone}
        </a>
      </div>
      <div className="request-item__row">
        <CarItemBit car={car} />
        <p className="request-item__value">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// RequestItemMini.propTypes = {
//   request: PropTypes.object.isRequired,
// };

export default RequestItemMini;
